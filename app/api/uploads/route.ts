import { NextResponse } from 'next/server'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { isSupabaseConfigured, supabaseServer } from '@/src/lib/supabaseServer'

export const runtime = 'nodejs'

const STORAGE_BUCKET = (process.env.SUPABASE_STORAGE_BUCKET || 'product-images').trim()
const LOCAL_UPLOAD_ROOT = join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024
const ALLOWED_MIME_PREFIX = 'image/'

let bucketReadyPromise: Promise<void> | null = null

const sanitizeFilename = (filename: string): string => {
  const trimmed = filename.trim().toLowerCase()
  const base = trimmed.replace(/\.[^.]+$/, '')
  const safe = base
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return safe || 'image'
}

const resolveExtension = (file: File): string => {
  const fileName = file.name || ''
  const extensionFromName = fileName.includes('.') ? fileName.split('.').pop() || '' : ''
  if (extensionFromName) return extensionFromName.toLowerCase()

  if (file.type === 'image/jpeg') return 'jpg'
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  if (file.type === 'image/gif') return 'gif'
  return 'bin'
}

const ensurePublicBucket = async () => {
  if (!STORAGE_BUCKET) {
    throw new Error('SUPABASE_STORAGE_BUCKET value is empty')
  }

  if (!bucketReadyPromise) {
    bucketReadyPromise = (async () => {
      const { data: existingBucket, error: bucketError } = await supabaseServer.storage.getBucket(STORAGE_BUCKET)

      if (bucketError) {
        const errorMessage = String(bucketError.message || '').toLowerCase()
        const notFound = errorMessage.includes('not found') || errorMessage.includes('does not exist')

        if (!notFound) {
          throw bucketError
        }

        const { error: createError } = await supabaseServer.storage.createBucket(STORAGE_BUCKET, {
          public: true,
        })

        if (createError) {
          const createMessage = String(createError.message || '').toLowerCase()
          if (!createMessage.includes('already exists')) {
            throw createError
          }
        }

        return
      }

      if (!existingBucket.public) {
        const { error: updateError } = await supabaseServer.storage.updateBucket(STORAGE_BUCKET, {
          public: true,
        })

        if (updateError) {
          throw updateError
        }
      }
    })().catch((error) => {
      bucketReadyPromise = null
      throw error
    })
  }

  await bucketReadyPromise
}

const writeLocalUpload = async (storagePath: string, fileBytes: ArrayBuffer): Promise<string> => {
  const localPath = join(LOCAL_UPLOAD_ROOT, storagePath)
  await mkdir(dirname(localPath), { recursive: true })
  await writeFile(localPath, Buffer.from(fileBytes))
  return `/uploads/${storagePath}`
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const fileFields = formData.getAll('files')
    const files = fileFields.filter((field): field is File => field instanceof File)

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files received' }, { status: 400 })
    }

    if (isSupabaseConfigured) {
      await ensurePublicBucket()
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith(ALLOWED_MIME_PREFIX)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type || 'unknown'}` },
          { status: 400 }
        )
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File is too large: ${file.name}. Max size is 20MB.` },
          { status: 400 }
        )
      }

      const extension = resolveExtension(file)
      const baseName = sanitizeFilename(file.name)
      const storagePath = `products/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${baseName}.${extension}`

      const bytes = await file.arrayBuffer()
      if (!isSupabaseConfigured) {
        const localUrl = await writeLocalUpload(storagePath, bytes)
        uploadedUrls.push(localUrl)
        continue
      }

      const { error: uploadError } = await supabaseServer.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, bytes, {
          upsert: false,
          contentType: file.type || 'application/octet-stream',
        })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabaseServer.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
      if (!data.publicUrl) {
        throw new Error('Public URL generation failed')
      }

      uploadedUrls.push(data.publicUrl)
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Image upload failed:', error)
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
  }
}
