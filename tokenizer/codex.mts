/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { BytePairDecoder } from '../BytePairDecoder.mjs'
import { BytePairEncoder } from '../BytePairEncoder.mjs'
import { BytePairEncoding } from '../BytePairEncoding.mjs'
import { DEFAULT_BPE_OPTIONS } from './data.mjs'

const codexEncoding = new BytePairEncoding({
  ...DEFAULT_BPE_OPTIONS,
  mergeSpaces: 'codex',
})

/**
 * Default Codex decoder.
 * This is a singleton instance of {@linkcode BytePairDecoder} that is pre-configured to decode GPT-3 tokens.
 */
export const codexEncoder = new BytePairEncoder(codexEncoding)

/**
 * Encodes a given UTF-8 string into a list of GPT-3 tokens.
 *
 * ```js
 * const codeText = [
 *   'function deeplyNested () {',
 *   '  return {',
 *   '    the: {',
 *   '      quick: {',
 *   '        brown: {',
 *   '...etc'
 * ].join('')
 *
 * const codexTokens = encodeToCodexTokens(codeText)
 * ```
 *
 * @see {@linkcode decodeCodexTokens} for the inverse function.
 * @see {@linkcode BytePairEncoder} for more information on how the tokens are decoded.
 */
export const encodeCodex = codexEncoder.encode

/**
 * Default Codex decoder.
 * This is a singleton instance of {@linkcode BytePairDecoder} that is pre-configured to decode GPT-3 tokens.
 */
export const codexDecoder = new BytePairDecoder(codexEncoding)

/**
 * Converts a list of Codex tokens into a string.
 *
 * ```ts
 * // Truncated for brevity...
 * const tokens = [8818, 7744, 45, 7287, 7499]
 * const text = codexDecoder.decode(tokens)
 * console.log(text)
 *
 * // `function deeplyNested () {
 * //   return {
 * //     the: {
 * //       quick: {
 * //         brown: {
 * // ...`
 * ```
 *
 * @see {@linkcode codexEncoder} for the inverse object.
 * @see {@linkcode BytePairDecoder} for more information on how the tokens are decoded.
 */
export const decodeCodex = codexDecoder.decode
