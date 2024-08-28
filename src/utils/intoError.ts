import { ZodError } from 'zod'
import { FromZodErrorOptions, fromZodError } from 'zod-validation-error'

/**
 * Creates an `Error` instance from the given `error` object.
 * If `error` is not an `Error` instance, a new `Error` instance is created with the given `fallbackMessage`.
 *
 * @param error - The object to be converted into an `Error` instance.
 * @param fallbackMessage - The message to use if `error` is not an `Error` instance.
 *
 * @returns An `Error` instance created from the given `error` object.
 *
 * @example
 * ```ts
 * const error = intoError(new TypeError('Something went wrong'), 'Fallback message');
 * // error is an Error instance with the message 'Something went wrong'
 * ```
 */
export default function intoError(
  error: unknown,
  fallbackMessage: string,
  zodErrorOptions?: FromZodErrorOptions
): Error {
  if (error instanceof ZodError) {
    console.error(error.message)
    return fromZodError(error, zodErrorOptions)
  }

  if (error instanceof Error) {
    console.error(error.message)
    return error
  }

  console.error(fallbackMessage)
  return new Error(fallbackMessage)
}
