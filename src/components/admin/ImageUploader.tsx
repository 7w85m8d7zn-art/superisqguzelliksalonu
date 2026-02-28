"use client"

import React, { useRef, useState } from 'react'

type Props = { inputName?: string; onPreviews?: (previews: string[]) => void }
type SelectedFileMeta = { name: string; size: number }
type ImageSize = { width: number; height: number }

const MIN_SHORT_EDGE = 900
const MIN_LONG_EDGE = 1200

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const level = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, level)
  return `${value.toFixed(level === 0 ? 0 : 1)} ${units[level]}`
}

function normalizeUploadedUrl(rawUrl: string): string {
  let normalized = rawUrl.trim()
  if (!normalized) return ''

  normalized = normalized.replace(/^[;,]+/, '')
  if (!normalized) return ''

  const lower = normalized.toLowerCase()
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('data:') ||
    lower.startsWith('blob:')
  ) {
    return normalized
  }

  if (normalized.startsWith('/products/')) return `/uploads${normalized}`
  if (normalized.startsWith('products/')) return `/uploads/${normalized}`
  if (normalized.startsWith('uploads/')) return `/${normalized}`
  if (!normalized.startsWith('/')) return `/${normalized}`

  return normalized
}

export default function ImageUploader({ inputName = 'images', onPreviews }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileMeta[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const getImageSize = (file: File): Promise<ImageSize> => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file)
      const image = new Image()

      image.onload = () => {
        const size = {
          width: image.naturalWidth || 0,
          height: image.naturalHeight || 0,
        }
        URL.revokeObjectURL(objectUrl)
        resolve(size)
      }

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error(`Gorsel okunamadi: ${file.name}`))
      }

      image.src = objectUrl
    })
  }

  const validateImageResolution = async (file: File): Promise<{ valid: boolean; error?: string }> => {
    const { width, height } = await getImageSize(file)
    const shortEdge = Math.min(width, height)
    const longEdge = Math.max(width, height)

    if (shortEdge < MIN_SHORT_EDGE || longEdge < MIN_LONG_EDGE) {
      return {
        valid: false,
        error: `${file.name} (${width}x${height}) dusuk cozumurlukte. En az ${MIN_SHORT_EDGE}px kisa kenar ve ${MIN_LONG_EDGE}px uzun kenar olmali.`,
      }
    }

    return { valid: true }
  }

  const uploadFiles = async (files: File[]) => {
    const body = new FormData()
    files.forEach((file) => body.append('files', file))

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body,
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(payload?.error || 'Upload failed')
    }

    const uploadedUrls = Array.isArray(payload?.urls)
      ? payload.urls
          .map((url: unknown) => (typeof url === 'string' ? url.trim() : ''))
          .map((url: string) => normalizeUploadedUrl(url))
          .filter((url: string) => url.length > 0)
      : []

    if (uploadedUrls.length === 0) {
      throw new Error('Upload returned no files')
    }

    setPreviews(uploadedUrls)
    if (onPreviews) onPreviews(uploadedUrls)
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    setUploadError('')
    setIsUploading(true)
    ;(async () => {
      const validFiles: File[] = []
      const validationErrors: string[] = []

      for (const file of fileArray) {
        try {
          const result = await validateImageResolution(file)
          if (result.valid) {
            validFiles.push(file)
          } else if (result.error) {
            validationErrors.push(result.error)
          }
        } catch (error) {
          validationErrors.push(error instanceof Error ? error.message : `${file.name} dogrulanamadi`)
        }
      }

      setSelectedFiles(
        validFiles.map((file) => ({
          name: file.name,
          size: file.size,
        }))
      )

      if (validationErrors.length > 0) {
        setUploadError(validationErrors.join(' | '))
      }

      if (validFiles.length === 0) {
        return
      }

      await uploadFiles(validFiles)
    })()
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Upload failed'
        setUploadError(message)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files)
    // Ayni dosyayi arka arkaya secmek icin input'u sifirla.
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        name={inputName}
        onChange={onChange}
        multiple
        type="file"
        accept="image/*"
        hidden
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
          isDragging ? 'border-slate-900 bg-slate-100' : 'border-slate-300 bg-white'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Gorsel Yukleme</p>
            <p className="text-xs text-slate-500">JPG, PNG ve WEBP dosyalari orijinal kalite ile yuklenir.</p>
            <p className="text-xs text-slate-500">Minimum cozumurluk: {MIN_SHORT_EDGE}px kisa kenar / {MIN_LONG_EDGE}px uzun kenar.</p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center justify-center rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? 'Yukleniyor...' : 'Görsel Seç'}
          </button>
        </div>

        {selectedFiles.length > 0 ? (
          <p className="mt-3 text-xs text-slate-600">
            {selectedFiles.length} görsel seçildi • {selectedFiles.map((file) => `${file.name} (${formatBytes(file.size)})`).join(', ')}
          </p>
        ) : (
          <p className="mt-3 text-xs text-slate-500">Isterseniz dosyalari bu alana surukleyip birakabilirsiniz.</p>
        )}

        {uploadError ? (
          <p className="mt-2 text-xs font-semibold text-red-600">{uploadError}</p>
        ) : null}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img
                src={preview}
                className="h-24 w-full bg-slate-100 object-contain"
                alt={selectedFiles[index]?.name ? `preview-${selectedFiles[index].name}` : `preview-${index}`}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
