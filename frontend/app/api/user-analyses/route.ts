import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
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

    // Get user's analyses
    const analyses = await prisma.analysis.findMany({
      where: { userId },
      include: {
        upload: {
          select: {
            id: true,
            fileName: true,
            uploadedAt: true,
          },
        },
      },
      orderBy: { analyzedAt: 'desc' },
    })

    // Parse preventive measures from JSON if needed
    const parsedAnalyses = analyses.map((analysis) => ({
      ...analysis,
      preventiveMeasures: Array.isArray(analysis.preventiveMeasures)
        ? analysis.preventiveMeasures
        : [],
    }))

    return NextResponse.json({ success: true, analyses: parsedAnalyses })
  } catch (error) {
    console.error('Get analyses error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve analyses' },
      { status: 500 }
    )
  }
}
