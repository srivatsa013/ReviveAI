from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import cv2
import numpy as np
import tensorflow as tf
import io

app = Flask(__name__)

# ✅ FIX 1: Allow correct frontend port
cors_origins = ["http://localhost:3000", "http://localhost:5173"]
frontend_origin = os.getenv("FRONTEND_ORIGIN")
if frontend_origin:
    cors_origins.append(frontend_origin)

CORS(app, origins=cors_origins)

# Global model variables
sharpen_model = None
scratch_model = None

# ✅ Load models
def load_sharpen_model():
    global sharpen_model
    if sharpen_model is None:
        print("Loading Sharpen model...")
        sharpen_model = tf.keras.models.load_model(
            "models/sharpening_model.keras",
            compile=False
        )
    return sharpen_model


def load_scratch_model():
    global scratch_model
    if scratch_model is None:
        print("Loading Scratch model...")
        scratch_model = tf.keras.models.load_model(
            "models/scratch_model.h5",
            compile=False
        )
    return scratch_model

# ✅ FIX 2: Add home route
@app.route('/')
def home():
    return "Backend running 🚀"

# Health check
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

# Main API
@app.route('/restore', methods=['POST'])
def restore():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['image']
        mode = request.form.get('mode')

        if mode not in ['sharpen', 'scratch']:
            return jsonify({"error": "Invalid mode"}), 400

        # Read image
        file_bytes = file.read()
        np_arr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # ✅ FIX 3: handle invalid image
        if img is None:
            return jsonify({"error": "Invalid image"}), 400

        original_shape = img.shape[:2]

        # Preprocess
        if mode == 'sharpen':
            img_resized = cv2.resize(img, (512, 512))
        else:  # scratch
            img_resized = cv2.resize(img, (256, 256))
        img_normalized = img_resized.astype(np.float32) / 255.0

        # Load model
        if mode == 'sharpen':
            model = load_sharpen_model()
        else:
            model = load_scratch_model()

        # Predict
        prediction = model.predict(np.expand_dims(img_normalized, axis=0))

        # Postprocess
        output = np.squeeze(prediction)
        output = np.clip(output, 0, 1)
        output = (output * 255).astype(np.uint8)
        output_resized = cv2.resize(output, (original_shape[1], original_shape[0]))

        # Encode
        success, encoded_img = cv2.imencode('.png', output_resized)
        if not success:
            return jsonify({"error": "Encoding failed"}), 500

        img_io = io.BytesIO(encoded_img.tobytes())
        img_io.seek(0)

        return send_file(img_io, mimetype='image/png')

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

# Run app
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port)