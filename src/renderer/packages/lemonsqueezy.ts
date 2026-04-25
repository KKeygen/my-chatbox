// LemonSqueezy license API calls removed — no external license validation.

export async function activateLicense(
  _key: string,
  _instanceName: string
): Promise<{
  valid: boolean
  instanceId: string
  error?: 'reached_activation_limit' | 'expired' | 'not_found'
}> {
  return { valid: false, instanceId: '', error: 'not_found' }
}

export async function deactivateLicense(_key: string, _instanceId: string): Promise<void> {}

export async function validateLicense(_key: string, _instanceId: string): Promise<{ valid: boolean }> {
  return { valid: false }
}
