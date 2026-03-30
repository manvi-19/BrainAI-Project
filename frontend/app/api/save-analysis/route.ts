import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const userId = formData.get('userId') as string
    const file = formData.get('file') as File | null
    const tumorType = formData.get('tumorType') as string
    const confidence = parseFloat(formData.get('confidence') as string)
    const description = formData.get('description') as string
    const preventiveMeasures = JSON.parse(formData.get('preventiveMeasures') as string)

    if (!userId || !file || !tumorType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const fileData = Buffer.from(buffer)

    // Save MRI Upload
    const upload = await prisma.mriUpload.create({
      data: {
        userId,
        fileName: file.name,
        fileData,
        mimeType: file.type,
      },
    })

    // Save Analysis
    const analysis = await prisma.analysis.create({
      data: {
        userId,
        uploadId: upload.id,
        tumorType,
        confidence,
        description,
        preventiveMeasures,
      },
    })

    return NextResponse.json(
      {
        success: true,
        analysisId: analysis.id,
        uploadId: upload.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Save analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to save analysis' },
      { status: 500 }
    )
  }
}
