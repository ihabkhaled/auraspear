import { describe, test, expect } from 'vitest'
import { getErrorKey, getFieldErrors, getFirstFieldError } from '@/lib/api-error'

describe('getErrorKey', () => {
  test('should extract messageKey from axios error', () => {
    const error = {
      response: {
        data: { messageKey: 'errors.users.notFound' },
      },
    }
    expect(getErrorKey(error)).toBe('errors.users.notFound')
  })

  test('should return unknown for null error', () => {
    expect(getErrorKey(null)).toBe('errors.common.unknown')
  })

  test('should return unknown for undefined error', () => {
    expect(getErrorKey(undefined)).toBe('errors.common.unknown')
  })

  test('should return unknown when no messageKey', () => {
    const error = { response: { data: {} } }
    expect(getErrorKey(error)).toBe('errors.common.unknown')
  })

  test('should return unknown when no response', () => {
    const error = new Error('Network error')
    expect(getErrorKey(error)).toBe('errors.common.unknown')
  })

  test('should return unknown for non-object error', () => {
    expect(getErrorKey('string error')).toBe('errors.common.unknown')
  })
})

describe('getFieldErrors', () => {
  test('should return field error keys', () => {
    const error = {
      response: {
        data: {
          errors: ['errors.validation.email.required', 'errors.validation.name.tooShort'],
        },
      },
    }
    expect(getFieldErrors(error)).toEqual([
      'errors.validation.email.required',
      'errors.validation.name.tooShort',
    ])
  })

  test('should return empty array when no errors', () => {
    const error = { response: { data: {} } }
    expect(getFieldErrors(error)).toEqual([])
  })

  test('should return empty array for null error', () => {
    expect(getFieldErrors(null)).toEqual([])
  })

  test('should return empty array when no response', () => {
    expect(getFieldErrors(new Error('fail'))).toEqual([])
  })
})

describe('getFirstFieldError', () => {
  test('should return first field error when present', () => {
    const error = {
      response: {
        data: {
          messageKey: 'errors.common.validation',
          errors: ['errors.validation.email.required', 'errors.validation.name.tooShort'],
        },
      },
    }
    expect(getFirstFieldError(error)).toBe('errors.validation.email.required')
  })

  test('should fall back to messageKey when no field errors', () => {
    const error = {
      response: {
        data: { messageKey: 'errors.users.notFound', errors: [] },
      },
    }
    expect(getFirstFieldError(error)).toBe('errors.users.notFound')
  })

  test('should fall back to messageKey when errors is undefined', () => {
    const error = {
      response: {
        data: { messageKey: 'errors.users.notFound' },
      },
    }
    expect(getFirstFieldError(error)).toBe('errors.users.notFound')
  })

  test('should return unknown for null error', () => {
    expect(getFirstFieldError(null)).toBe('errors.common.unknown')
  })
})
