import { NextRequest, NextResponse } from "next/server"

// Point this to your Python Flask/FastAPI server
const ML_SERVER_URL = process.env.ML_SERVER_URL || "http://localhost:5000"

// Metadata for each tumour type (hardcoded recommendations)
const TUMOUR_METADATA: Record<
  string,
  { description: string; severity: string; preventiveMeasures: string[] }
> = {
  Glioma: {
    description:
      "Gliomas are tumours that originate from glial cells in the brain. They are the most common type of primary brain tumour and can vary in aggressiveness.",
    severity: "High",
    preventiveMeasures: [
      "Regular follow-up MRI scans every 3-6 months",
      "Consult a neuro-oncologist for treatment planning",
      "Consider radiation therapy or chemotherapy as recommended",
      "Maintain a healthy lifestyle with proper nutrition",
      "Manage stress through meditation and relaxation techniques",
      "Keep a symptom diary to track any changes",
    ],
  },
  Meningioma: {
    description:
      "Meningiomas are usually benign tumours that develop from the membranes surrounding the brain and spinal cord. Most grow slowly and may not require immediate treatment.",
    severity: "Moderate",
    preventiveMeasures: [
      "Regular monitoring with MRI scans every 6-12 months",
      "Consult a neurosurgeon if symptoms worsen",
      "Watch for headaches, vision changes, or seizures",
      "Maintain a healthy weight and active lifestyle",
      "Avoid unnecessary exposure to radiation",
      "Consider surgical removal if the tumour grows",
    ],
  },
  "Pituitary Tumour": {
    description:
      "Pituitary tumours are abnormal growths in the pituitary gland. Most are benign and treatable with medication or surgery.",
    severity: "Low to Moderate",
    preventiveMeasures: [
      "Regular hormone level testing every 3-6 months",
      "Consult an endocrinologist for hormone management",
      "Monitor vision regularly with an ophthalmologist",
      "Take prescribed medications consistently",
      "Report any changes in vision, headaches, or hormonal symptoms",
      "Consider surgery if medication is insufficient",
    ],
  },
  "No Tumour": {
    description:
      "The MRI scan appears normal with no signs of tumour growth detected by the AI model.",
    severity: "None",
    preventiveMeasures: [
      "Continue regular health check-ups",
      "Maintain a healthy and balanced diet",
      "Exercise regularly for overall brain health",
      "Get adequate sleep (7-9 hours per night)",
      "Manage stress through healthy coping mechanisms",
      "Report any new or persistent symptoms to your doctor",
    ],
  },
}

// Normalize model output safely
function normalizePredictionType(type: string | undefined): string {
  if (!type) return "No Tumour"

  const normalized = type.trim().toLowerCase()

  const mapping: Record<string, string> = {
    glioma: "Glioma",
    meningioma: "Meningioma",
    "pituitary tumour": "Pituitary Tumour",
    pituitary: "Pituitary Tumour",
    "pituitary tumor": "Pituitary Tumour",
    "no tumour": "No Tumour",
    "no tumor": "No Tumour",
    normal: "No Tumour",
  }

  return mapping[normalized] || "No Tumour"
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Forward image to Python ML server
    const mlFormData = new FormData()
    mlFormData.append("file", file)

    const mlResponse = await fetch(`${ML_SERVER_URL}/predict`, {
      method: "POST",
      body: mlFormData,
    })

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text()
      console.error("ML server error:", errorText)

      return NextResponse.json(
        { error: "Model server returned an error. Is the Python server running?" },
        { status: 502 }
      )
    }

    const prediction = await mlResponse.json()

    console.log("Raw ML Prediction:", prediction)

    // Normalize predicted type
    const matchedType = normalizePredictionType(prediction.type)

    const metadata = TUMOUR_METADATA[matchedType]

    return NextResponse.json({
      type: matchedType,
      confidence: prediction.confidence,
      description: metadata.description,
      severity: metadata.severity,
      preventiveMeasures: metadata.preventiveMeasures,
      allPredictions: prediction.all_predictions ?? null,
    })
  } catch (error) {
    console.error("Analysis API error:", error)

    return NextResponse.json(
      {
        error:
          "Could not connect to the ML model server. Make sure your Python server is running on " +
          (process.env.ML_SERVER_URL || "http://localhost:5000"),
      },
      { status: 503 }
    )
  }
}
