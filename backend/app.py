from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import cv2
import numpy as np
import tensorflow as tf
import io

app = Flask(__name__)

# ── CORS ──────────────────────────────────────────────────────────────────────
cors_origins = ["http://localhost:3000", "http://localhost:5173"]
frontend_origin = os.getenv("FRONTEND_ORIGIN")
if frontend_origin:
    cors_origins.append(frontend_origin)
CORS(app, origins=cors_origins)

# ── Custom loss (required to load sharpening_model.keras) ────────────────────
def ssim_l1_loss(y_true, y_pred):
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(y_pred, tf.float32)
    ssim_loss = 1.0 - tf.reduce_mean(tf.image.ssim(y_true, y_pred, max_val=1.0))
    l1_loss   = tf.reduce_mean(tf.abs(y_true - y_pred))
    return 0.84 * ssim_loss + 0.16 * l1_loss

# ── Global model variables ────────────────────────────────────────────────────
sharpen_model = None
lama_model = None

def load_sharpen_model():
    global sharpen_model
    if sharpen_model is None:
        print("Loading Sharpen model...")
        sharpen_model = tf.keras.models.load_model(
            "models/sharpening_model.keras",
            custom_objects={"ssim_l1_loss": ssim_l1_loss},
            compile=False
        )
        print("Sharpen model loaded.")
    return sharpen_model

def load_scratch_model():
    global lama_model  # reuse same variable name, or rename to scratch_model
    if lama_model is None:
        print("Loading Scratch Removal U-Net model...")
        from huggingface_hub import hf_hub_download
        model_path = hf_hub_download(
            repo_id="Sami-on-hugging-face/RevAI_Scratch_Removal_Model",
            filename="scratch_removal_test2.h5"
        )
        lama_model = tf.keras.models.load_model(model_path, compile=False)
        print("Scratch model loaded.")
    return lama_model

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route('/')
def home():
    return "Backend running 🚀"

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

@app.route('/restore', methods=['POST'])
def restore():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['image']
        mode = request.form.get('mode')

        if mode not in ['sharpen', 'scratch']:
            return jsonify({"error": "Invalid mode. Use 'sharpen' or 'scratch'"}), 400

        # ── Read image ────────────────────────────────────────────────────────
        file_bytes = file.read()
        np_arr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid or unreadable image"}), 400

        original_shape = img.shape[:2]  # (H, W)

        # ── BGR → RGB ─────────────────────────────────────────────────────────
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        if mode == 'sharpen':
            # ── Resize to 512x512 for sharpen model ───────────────────────────
            img_resized = cv2.resize(img_rgb, (256, 256))
            img_normalized = img_resized.astype(np.float32) / 255.0

            model = load_sharpen_model()
            prediction = model.predict(np.expand_dims(img_normalized, axis=0), verbose=0)

            output = np.squeeze(prediction)
            output = np.clip(output, 0, 1)
            output = (output * 255).astype(np.uint8)
            output = cv2.cvtColor(output, cv2.COLOR_RGB2BGR)

        else:  # scratch
            scratch_mdl = load_scratch_model()

            img_resized = cv2.resize(img_rgb, (256, 256))
            img_normalized = img_resized.astype(np.float32) / 255.0

            prediction = scratch_mdl.predict(np.expand_dims(img_normalized, axis=0), verbose=0)

            output = np.squeeze(prediction)
            output = np.clip(output, 0, 1)
            output = (output * 255).astype(np.uint8)
            output = cv2.cvtColor(output, cv2.COLOR_RGB2BGR)

        # ── Resize back to original dimensions ───────────────────────────────
        output_resized = cv2.resize(output, (original_shape[1], original_shape[0]))

        # ── Encode to PNG and return ──────────────────────────────────────────
        success, encoded_img = cv2.imencode('.png', output_resized)
        if not success:
            return jsonify({"error": "Image encoding failed"}), 500

        img_io = io.BytesIO(encoded_img.tobytes())
        img_io.seek(0)
        return send_file(img_io, mimetype='image/png')

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port)