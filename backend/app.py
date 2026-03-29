from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import io
from PIL import Image

import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.preprocessing import image
from tensorflow.keras import layers, models

app = Flask(__name__)
CORS(app)

# ===============================
# MODEL SETUP (MATCH TRAINING)
# ===============================

NUM_CLASSES = 4
CLASS_LABELS = ["glioma", "meningioma", "notumor", "pituitary"]
IMAGE_SIZE = (224, 224)

MODEL_WEIGHTS_PATH = "model/brain_tumor_model.h5"  # 👈 epoch 10 file

# Rebuild the SAME model architecture
base = VGG16(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)
base.trainable = False

model = models.Sequential([
    base,
    layers.Flatten(),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.5),
    layers.Dense(NUM_CLASSES, activation="softmax")
])

# Load trained weights
model.load_weights(MODEL_WEIGHTS_PATH)

print("✅ Model loaded successfully")

# ===============================
# PREDICTION ROUTE
# ===============================

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    img = Image.open(io.BytesIO(file.read())).convert("RGB")
    img = img.resize(IMAGE_SIZE)

    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # same as training

    predictions = model.predict(img_array)
    predicted_index = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][predicted_index]) * 100

    return jsonify({
        "type": CLASS_LABELS[predicted_index],
        "confidence": round(confidence, 1),
        "all_predictions": {
            CLASS_LABELS[i]: round(float(predictions[0][i]) * 100, 1)
            for i in range(NUM_CLASSES)
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
