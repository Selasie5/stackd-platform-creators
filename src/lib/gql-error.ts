export function extractGqlError(error: unknown): string {
  if (!error || typeof error !== 'object') return 'An unexpected error occurred.'

  if ('graphQLErrors' in error) {
    const gqlErrors = (error as { graphQLErrors: Array<{ message: string }> }).graphQLErrors
    if (gqlErrors.length > 0) return gqlErrors[0].message
  }

  if ('errors' in error) {
    const errors = (error as { errors: Array<{ message?: string }> }).errors
    if (Array.isArray(errors) && errors[0]?.message) return errors[0].message
  }

  if ('message' in error && typeof error.message === 'string' && error.message.trim()) {
    return error.message
  }

  return 'An unexpected error occurred.'
}
