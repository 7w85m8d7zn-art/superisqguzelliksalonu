import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export interface FallbackSettingEntry {
  value: unknown
  updated_at: string
}

export interface FallbackSettingsData {
  settings: Record<string, FallbackSettingEntry>
}

const STORE_FILE_PATH = join(process.cwd(), '.data', 'settings-fallback.json')

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const normalizeSettingKey = (key: string): string => key.trim()

const normalizeDate = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }
  return new Date().toISOString()
}

const normalizeEntry = (value: unknown): FallbackSettingEntry | null => {
  if (!isRecord(value)) return null

  const normalizedValue = 'value' in value ? (value.value === undefined ? null : value.value) : null
  return {
    value: normalizedValue,
    updated_at: normalizeDate(value.updated_at),
  }
}

const buildInitialData = (): FallbackSettingsData => ({
  settings: {},
})

const normalizeFallbackData = (value: unknown): FallbackSettingsData => {
  if (!isRecord(value) || !isRecord(value.settings)) {
    return buildInitialData()
  }

  const settings = Object.entries(value.settings).reduce<Record<string, FallbackSettingEntry>>(
    (acc, [rawKey, rawEntry]) => {
      const key = normalizeSettingKey(rawKey)
      if (!key) return acc

      const normalizedEntry = normalizeEntry(rawEntry)
      if (!normalizedEntry) return acc

      acc[key] = normalizedEntry
      return acc
    },
    {}
  )

  return { settings }
}

const ensureStoreFile = async (): Promise<void> => {
  await mkdir(dirname(STORE_FILE_PATH), { recursive: true })

  try {
    await readFile(STORE_FILE_PATH, 'utf8')
  } catch (error) {
    const errorCode =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: unknown }).code)
        : ''

    if (errorCode !== 'ENOENT') {
      throw error
    }

    await writeFile(STORE_FILE_PATH, JSON.stringify(buildInitialData(), null, 2), 'utf8')
  }
}

export async function readFallbackSettingsData(): Promise<FallbackSettingsData> {
  await ensureStoreFile()

  try {
    const raw = await readFile(STORE_FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    return normalizeFallbackData(parsed)
  } catch (error) {
    console.warn('Fallback settings store read failed, resetting store:', error)
    const initialData = buildInitialData()
    await writeFile(STORE_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf8')
    return initialData
  }
}

export async function writeFallbackSettingsData(nextData: FallbackSettingsData): Promise<void> {
  await ensureStoreFile()
  const normalizedData = normalizeFallbackData(nextData)
  await writeFile(STORE_FILE_PATH, JSON.stringify(normalizedData, null, 2), 'utf8')
}

export async function getFallbackSettingsMap(): Promise<Record<string, unknown>> {
  const data = await readFallbackSettingsData()
  return Object.entries(data.settings).reduce<Record<string, unknown>>((acc, [key, entry]) => {
    acc[key] = entry.value
    return acc
  }, {})
}

export async function getFallbackSettingValueByKey(key: string): Promise<unknown | null> {
  const normalizedKey = normalizeSettingKey(key)
  if (!normalizedKey) return null

  const data = await readFallbackSettingsData()
  const entry = data.settings[normalizedKey]
  return entry ? entry.value : null
}

export async function upsertFallbackSetting(
  key: string,
  value: unknown
): Promise<{ key: string; value: unknown; updated_at: string }> {
  const normalizedKey = normalizeSettingKey(key)
  if (!normalizedKey) {
    throw new Error('key is required')
  }

  const data = await readFallbackSettingsData()
  const updatedAt = new Date().toISOString()

  data.settings[normalizedKey] = {
    value: value === undefined ? null : value,
    updated_at: updatedAt,
  }

  await writeFallbackSettingsData(data)

  return {
    key: normalizedKey,
    value: data.settings[normalizedKey].value,
    updated_at: updatedAt,
  }
}
