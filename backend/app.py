from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import io
from PIL import Image
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras import layers, models
import os

app = Flask(__name__)
CORS(app)

# ===============================
# CONFIG
# ===============================

NUM_CLASSES = 4
CLASS_LABELS = ["glioma", "meningioma", "notumor", "pituitary"]  # verify once
IMAGE_SIZE = (224, 224)

WEIGHTS_PATH = "model/brain_tumor_weights.weights.h5"

# ===============================
# REBUILD EXACT TRAINING ARCHITECTURE
# ===============================

base = VGG16(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)
base.trainable = False

model = models.Sequential([
    layers.Input(shape=(224, 224, 3)),
    base,
    layers.Flatten(),
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.5),
    layers.Dense(NUM_CLASSES, activation="softmax")
])

# Build once before loading weights
model.build((None, 224, 224, 3))

# Load ONLY weights
model.load_weights(WEIGHTS_PATH)
print("✅ Weights loaded successfully")

# ===============================
# PREDICTION ROUTE
# ===============================

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    try:
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        img = img.resize(IMAGE_SIZE, Image.Resampling.BILINEAR)

        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)

        # Must match training preprocessing
        img_array = img_array / 255.0

        predictions = model.predict(img_array)
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_index]) * 100

        print("Raw predictions:", predictions[0])
        print("Predicted index:", predicted_index)
        print("Predicted class:", CLASS_LABELS[predicted_index])

        return jsonify({
            "type": CLASS_LABELS[predicted_index],
            "confidence": round(confidence, 1),
            "all_predictions": {
                CLASS_LABELS[i]: round(float(predictions[0][i]) * 100, 1)
                for i in range(NUM_CLASSES)
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ===============================
# RUN SERVER
# ===============================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)