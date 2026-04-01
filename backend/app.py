from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import io
from PIL import Image
import tensorflow as tf
import os

app = Flask(__name__)
CORS(app)

# ===============================
# CONFIG
# ===============================

NUM_CLASSES = 4
CLASS_LABELS = ["glioma", "meningioma", "notumor", "pituitary"]  # verify once
IMAGE_SIZE = (224, 224)

MODEL_PATH = "model/brain_tumor_model.h5"

# ===============================
# LOAD FULL TRAINED MODEL
# ===============================

model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Full model loaded successfully")

# ===============================
# PREDICTION ROUTE
# ===============================

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    try:
        # Load image
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        img = img.resize(IMAGE_SIZE, Image.Resampling.BILINEAR)

        # Convert to array
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)

        # Normalize (IMPORTANT: must match training)
        img_array = img_array / 255.0

        # Prediction
        predictions = model.predict(img_array)
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_index]) * 100

        # Debug logs (optional but useful)
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