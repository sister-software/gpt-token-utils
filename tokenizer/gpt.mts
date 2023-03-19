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

// We can use a single instance for both encoding and decoding GPT tokens.
const gptEncoding = new BytePairEncoding(DEFAULT_BPE_OPTIONS)

/**
 * Encodes a given UTF-8 string into a list of GPT-3 tokens.
 *
 * ```js
 * const text = "Do androids dream of electric sheep?"
 * const tokens = encoder.encode(text)
 * console.log(tokens) // [5211, 290, 305, 2340, 4320, 286, 5186, 15900, 30]
 * ```
 *
 * @see {@linkcode gptDecoder} for the inverse function.
 * @see {@linkcode BytePairEncoder} for more information on how the tokens are decoded.
 */
export const gptEncoder = new BytePairEncoder(gptEncoding)

/**
 * Converts a list of GPT-3 tokens into a string.
 *
 * ```ts
 * const tokens = [5211, 290, 305, 2340, 4320, 286, 5186, 15900, 30]
 * const text = decodeGPTTokens(tokens)
 * console.log(text) // "Do androids dream of electric sheep?"
 * ```
 *
 * @see {@linkcode gptEncoder} for the inverse function.
 * @see {@linkcode BytePairDecoder} for more information on how the tokens are decoded.
 */
export const gptDecoder = new BytePairDecoder(gptEncoding)
