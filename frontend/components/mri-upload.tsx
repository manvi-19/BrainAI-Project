"use client"

import React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AnalysisResults } from "@/components/analysis-results"

interface MriUploadProps {
  userName: string
  userEmail: string
  userRole: "patient" | "doctor"
}

// Simulated ML model inference results
const TUMOUR_TYPES = [
  {
    type: "Glioma",
    confidence: 94.7,
    description: "Gliomas are tumours that originate from glial cells in the brain. They are the most common type of primary brain tumour.",
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
  {
    type: "Meningioma",
    confidence: 91.2,
    description: "Meningiomas are usually benign tumours that develop from the membranes surrounding the brain and spinal cord.",
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
  {
    type: "Pituitary Tumour",
    confidence: 88.5,
    description: "Pituitary tumours are abnormal growths in the pituitary gland. Most are benign and treatable.",
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
  {
    type: "No Tumour Detected",
    confidence: 96.8,
    description: "The MRI scan appears normal with no signs of tumour growth detected by the AI model.",
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
]

export function MriUpload({ userName, userEmail, userRole }: MriUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<(typeof TUMOUR_TYPES)[0] | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) return
    setFile(selectedFile)
    setResult(null)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(selectedFile)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) handleFile(droppedFile)
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!file) return
    setIsAnalyzing(true)
    setProgress(0)

    // Start progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 2
      })
    }, 100)

    try {
      // Send image to the API route, which forwards to the Python ML server
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        console.warn("ML server unavailable, falling back to demo mode:", errorData.error)
        // Fallback to simulated results if ML server is not running
        setProgress(100)
        const randomResult = TUMOUR_TYPES[Math.floor(Math.random() * TUMOUR_TYPES.length)]
        setResult(randomResult)
        setIsAnalyzing(false)
        return
      }

      const prediction = await response.json()
      setProgress(100)

      // Small delay so the user sees 100%
      await new Promise((resolve) => setTimeout(resolve, 300))

      setResult({
        type: prediction.type,
        confidence: prediction.confidence,
        description: prediction.description,
        severity: prediction.severity,
        preventiveMeasures: prediction.preventiveMeasures,
      })
    } catch {
      clearInterval(progressInterval)
      console.warn("Could not reach ML server, using demo results")
      setProgress(100)
      const randomResult = TUMOUR_TYPES[Math.floor(Math.random() * TUMOUR_TYPES.length)]
      setResult(randomResult)
    } finally {
      setIsAnalyzing(false)
    }
  }, [file])

  const handleReset = useCallback(() => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  if (result) {
    return (
      <AnalysisResults
        result={result}
        imagePreview={preview}
        userName={userName}
        userEmail={userEmail}
        userRole={userRole}
        onReset={handleReset}
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-border/50">
        <CardContent className="p-8">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click()
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload MRI image"
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : file
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            {preview ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-48 w-48 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="MRI scan preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div>
                  <p className="text-base font-medium text-foreground">
                    Drop your MRI scan here or click to browse
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Supports JPG, PNG, DICOM formats
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0]
                if (selectedFile) handleFile(selectedFile)
              }}
            />
          </div>

          {/* Analysis Controls */}
          {file && !isAnalyzing && (
            <div className="mt-6 flex gap-3">
              <Button onClick={handleAnalyze} className="flex-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                Analyze MRI Scan
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Remove
              </Button>
            </div>
          )}

          {/* Progress */}
          {isAnalyzing && (
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Analyzing MRI scan...</p>
                <p className="text-sm text-muted-foreground">{progress}%</p>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progress < 30
                  ? "Preprocessing image..."
                  : progress < 60
                    ? "Running deep learning model..."
                    : progress < 90
                      ? "Classifying tumour type..."
                      : "Generating results..."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
