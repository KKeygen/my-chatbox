import { setRuntimeRegistry } from '@shared/model-registry/enrich'
import { MODELS_DEV_SNAPSHOT } from '@shared/model-registry/snapshot.generated'
import type { ModelRegistryData } from '@shared/model-registry/types'

// Remote fetch from models.dev removed — use only the bundled snapshot for privacy.

let memoryCache: ModelRegistryData | null = null
let registryVersion = 0
const listeners = new Set<() => void>()

function notifyListeners(): void {
  registryVersion += 1
  for (const listener of listeners) {
    listener()
  }
}

function applyRegistry(data: ModelRegistryData): ModelRegistryData {
  memoryCache = data
  setRuntimeRegistry(data)
  notifyListeners()
  return data
}

/**
 * Get the best available registry data synchronously.
 * Always returns the bundled snapshot.
 */
export function getRegistrySync(): ModelRegistryData {
  if (memoryCache) return memoryCache
  return MODELS_DEV_SNAPSHOT
}

/**
 * Get registry data — returns the bundled snapshot (no remote fetch).
 */
export async function getRegistry(): Promise<ModelRegistryData> {
  if (memoryCache) return memoryCache
  return applyRegistry(MODELS_DEV_SNAPSHOT)
}

/**
 * No-op: remote fetch removed. Returns the bundled snapshot.
 */
export function fetchAndUpdateRegistry(
  fallbackData: ModelRegistryData = getRegistrySync()
): Promise<ModelRegistryData> {
  return Promise.resolve(applyRegistry(fallbackData))
}

/**
 * Prefetch registry data on startup — uses bundled snapshot only.
 */
export async function prefetchModelRegistry(): Promise<void> {
  applyRegistry(MODELS_DEV_SNAPSHOT)
}

/**
 * "Force refresh" — returns the bundled snapshot (no remote fetch).
 */
export async function forceRefreshRegistry(): Promise<ModelRegistryData> {
  return applyRegistry(MODELS_DEV_SNAPSHOT)
}

export function subscribeRegistry(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getRegistryVersion(): number {
  return registryVersion
}
