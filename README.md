# ReviveAI ✨

<p align="center">
  <img src="./assets/revive banner.png" alt="ReviveAI Logo" width="50%"/>
<p align="center">
  <em>Restore your memories. AI-powered image sharpening and scratch removal.</em>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Build-Passing-brightgreen" alt="Build Status"></a>
  <a href="link/to/your/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/Python-3.8+-blueviolet" alt="Python Version"></a>
  <a href="link/to/your/contributing/guide"><img src="https://img.shields.io/badge/Contributions-Welcome-orange" alt="Contributions Welcome"></a>
</p>

---

## 📖 About ReviveAI

ReviveAI leverages the power of Artificial Intelligence to breathe new life into your old or degraded photographs. Whether it's blurriness from camera shake, general lack of sharpness, or physical damage like scratches, ReviveAI aims to restore clarity and detail, preserving your precious moments.

This project features a React frontend and a Flask backend, with deep learning models served via API and hosted on Hugging Face Hub.

---

## 🔥 Key Features

<p align="center"><img src="./assets/features.png" alt="Features" width="100%"/></p>

- **✅ Completed — Image Sharpening:** Enhances fine details and edges for a crisper look.
- **✅ Completed — Scratch Removal:** Intelligently detects and removes scratches and minor damage from photographs.
- **🛠️ Coming Soon — Image Colorization:** Adds realistic color to grayscale images.

---

## ✨ Before & After Showcase

<p align="center">

| Examples | Task Performed |
| :-----------------------------------------: | :----------------- |
| <img src="./assets/sharpen1.png" width="650"> | Image Sharpening |
| <img src="./assets/sharpen2.png" width="650"> | Image Sharpening |
| <img src="./assets/scratch1.png" width="650"> | Scratch Removal |
| <img src="./assets/scratch2.png" width="650"> | Scratch Removal |

</p>

---

## 🛠️ Tech Stack

<p align="center">
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python"/></a>
  <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"/></a>
  <a href="https://www.tensorflow.org/"><img src="https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white" alt="TensorFlow"/></a>
  <a href="https://opencv.org/"><img src="https://img.shields.io/badge/opencv-%235C3EE8.svg?style=for-the-badge&logo=opencv&logoColor=white" alt="OpenCV"/></a>
  <a href="https://numpy.org/"><img src="https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy"/></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React"/></a>
</p>

---

## 📊 Implementation Status

| Feature / Component         | Status           | Notes                     |
| :-------------------------- | :--------------- | :------------------------ |
| Image Sharpening            | ✅ Completed     | Core model functional     |
| Scratch Removal             | ✅ Completed     | Core model functional     |
| Image Colorization          | 🚧 In Progress   | Coming soon               |

---

## 📁 Folder Structure

```
ReviveAI/
│
├── README.md
├── .gitignore
│
├── backend/
│   ├── app.py                        # Flask API server
│   ├── requirements.txt
│   ├── Procfile
│   └── models/
│       ├── sharpening_model.keras    # Local model (not in git — see HF Hub)
│       └── scratch_removal.h5        # Local model (not in git — see HF Hub)
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── notebooks/
│   ├── scratch_removal_notebook.ipynb
│   └── sharpening_model_notebook.ipynb
│
├── before_after_examples/
│   ├── sharpening/
│   └── scratch_removal/
│
└── assets/
    └── revive banner.png, showcase images, etc.
```

> **Note:** Model files (`.keras`, `.h5`) are not committed to this repo. They are hosted on Hugging Face Hub and loaded automatically at runtime (see below).

---

## 🚀 Getting Started

### 1. Prerequisites

- Python 3.8+
- Node.js 16+
- `pip` and `npm`
- Git

---

### 2. Clone the Repository

```bash
git clone https://github.com/srivatsa013/ReviveAI.git
cd ReviveAI
```

---

### 3. Set Up the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The Flask server will start on `http://localhost:5001`.

---

### 4. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

---

## 🌐 API Reference

The backend exposes a single REST endpoint:

### `POST /restore`

Restores an image using the selected mode.

**Request** — `multipart/form-data`:

| Field   | Type   | Required | Description                          |
| :------ | :----- | :------- | :----------------------------------- |
| `image` | file   | ✅       | The image file to restore            |
| `mode`  | string | ✅       | Either `"sharpen"` or `"scratch"`    |

**Response:** PNG image file (binary)

**Example using curl:**

```bash
# Sharpen mode
curl -X POST http://localhost:5001/restore \
  -F "image=@your_image.jpg" \
  -F "mode=sharpen" \
  --output restored.png

# Scratch removal mode
curl -X POST http://localhost:5001/restore \
  -F "image=@your_image.jpg" \
  -F "mode=scratch" \
  --output restored.png
```

**Other endpoints:**

| Method | Endpoint  | Description         |
| :----- | :-------- | :------------------ |
| GET    | `/`       | Health check string |
| GET    | `/health` | Returns `{"status": "healthy"}` |

---

## 🎯 Pretrained Models (Hugging Face)

Models are downloaded automatically on first request. You can also load them manually:

### 🔹 Sharpening Model
 
Loaded locally from `backend/models/sharpening_model.keras`. Place the file there before starting the backend. Uses a custom loss function:
 
```python
import tensorflow as tf
from tensorflow.keras.models import load_model
 
def ssim_l1_loss(y_true, y_pred):
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(y_pred, tf.float32)
    ssim_loss = 1.0 - tf.reduce_mean(tf.image.ssim(y_true, y_pred, max_val=1.0))
    l1_loss   = tf.reduce_mean(tf.abs(y_true - y_pred))
    return 0.84 * ssim_loss + 0.16 * l1_loss
 
model = load_model(
    "models/sharpening_model.keras",
    custom_objects={"ssim_l1_loss": ssim_l1_loss},
    compile=False
)
```

### 🔹 Scratch Removal Model

```python
from huggingface_hub import hf_hub_download
from tensorflow.keras.models import load_model

model_path = hf_hub_download(
    repo_id="Sami-on-hugging-face/RevAI_Scratch_Removal_Model",
    filename="scratch_removal_test2.h5"
)
model = load_model(model_path, compile=False)
```

---

## 🧪 Training Notebooks

| Notebook | Description |
| :------- | :---------- |
| `sharpening_model_notebook.ipynb` | Train the sharpening model + run predictions |
| `scratch_removal_notebook.ipynb`  | Train the scratch removal model + run predictions |

Each notebook includes model architecture, data loading, training pipeline, and a visual before/after demo.

---

### 🖼️ Quick Inference Function

```python
def display_prediction(image_path, model):
    import cv2
    import matplotlib.pyplot as plt
    import numpy as np

    img = cv2.imread(image_path)
    img = cv2.resize(img, (256, 256)) / 255.0
    input_img = np.expand_dims(img, axis=0)
    predicted = model.predict(input_img)[0]

    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    plt.imshow(img[..., ::-1])
    plt.title("Original Input")
    plt.axis("off")
    plt.subplot(1, 2, 2)
    plt.imshow(predicted)
    plt.title("Model Output")
    plt.axis("off")
    plt.show()

display_prediction("your_image.jpg", model)
```

---

<div align="center">
  <h2><b>ReviveAI</b></h2>
  <h3>Made with ❤️ by Srivatsa</h3>

  ---
</div>
