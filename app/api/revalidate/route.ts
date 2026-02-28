import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 })
  }

  try {
    revalidatePath(path)
    return NextResponse.json({
      revalidated: true,
      path,
      message: 'Path revalidated successfully'
    })
  } catch (err) {
    return NextResponse.json({
      revalidated: false,
      path,
      error: 'Failed to revalidate'
    }, { status: 500 })
  }
}
