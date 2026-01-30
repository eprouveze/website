import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// Valid product types for type safety
type ProductType = 'starter' | 'complete' | 'executive'

const VALID_PRODUCTS: ProductType[] = ['starter', 'complete', 'executive']

// Storage bucket name
const STORAGE_BUCKET = 'products'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  // Validate token parameter
  if (!token) {
    return NextResponse.json(
      { error: 'Missing token parameter' },
      { status: 400 }
    )
  }

  // Validate token format (should be a UUID)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(token)) {
    return NextResponse.json(
      { error: 'Invalid token format' },
      { status: 400 }
    )
  }

  try {
    const supabase = createServiceClient()

    // Look up purchase by token
    const { data: purchase, error: fetchError } = await supabase
      .from('purchases')
      .select('*')
      .eq('download_token', token)
      .single()

    // Handle purchase not found
    if (fetchError || !purchase) {
      console.error('Purchase lookup error:', fetchError)
      return NextResponse.json(
        { error: 'Invalid download token' },
        { status: 403 }
      )
    }

    // Check if token has expired
    const expiresAt = new Date(purchase.expires_at)
    if (expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: 'Download link has expired',
          expired_at: purchase.expires_at,
        },
        { status: 403 }
      )
    }

    // Check download count limit
    if (purchase.download_count >= purchase.max_downloads) {
      return NextResponse.json(
        {
          error: 'Download limit reached',
          downloads_used: purchase.download_count,
          max_downloads: purchase.max_downloads,
        },
        { status: 403 }
      )
    }

    // Validate product type
    if (!VALID_PRODUCTS.includes(purchase.product as ProductType)) {
      console.error('Invalid product type:', purchase.product)
      return NextResponse.json(
        { error: 'Invalid product configuration' },
        { status: 500 }
      )
    }

    // Construct file name
    const fileName = `myvoicetwin-${purchase.product}.zip`

    // Increment download count BEFORE serving file
    // This prevents race conditions where multiple downloads could be initiated
    const { error: updateError } = await supabase
      .from('purchases')
      .update({ download_count: purchase.download_count + 1 })
      .eq('id', purchase.id)
      .eq('download_count', purchase.download_count) // Optimistic locking

    if (updateError) {
      console.error('Failed to update download count:', updateError)
      // Continue with download even if count update fails
      // The count check above already validated the limit
    }

    // Fetch file from Supabase Storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(fileName)

    if (storageError || !fileData) {
      console.error('Storage error:', storageError)
      return NextResponse.json(
        { error: 'Failed to retrieve file. Please try again or contact support.' },
        { status: 500 }
      )
    }

    // Convert Blob to ArrayBuffer for response
    const arrayBuffer = await fileData.arrayBuffer()

    // Return file with appropriate headers
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': arrayBuffer.byteLength.toString(),
        // Prevent caching of download links
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Security headers
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again or contact support.' },
      { status: 500 }
    )
  }
}

// Reject other HTTP methods
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
