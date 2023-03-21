/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { BytePairEncoding } from './BytePairEncoding.mjs'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { BytePairEncoder } from './BytePairEncoder.mjs'
import type { EncoderResult } from './EncoderResult.mjs'

/**
 * Methods associated with decoding a list of tokens into a string.
 */
export interface TokenDecodeFn {
  (
    /**
     * The list of tokens to decode.
     */
    tokens: number[]
  ): string

  (
    /**
     * The resulting object of the {@linkcode BytePairEncoder.encode} function.
     */
    encoderResult: EncoderResult
  ): string
}

/**
 * GPT Token Decoder.
 *
 * Generally, you should not need to use this class directly unless you are
 * implementing a custom token decoder.
 *
 * @see {@linkcode BytePairEncoder} for the encoder.
 *
 * ```ts
 * const decoder = new BytePairDecoder({codePointByteMap, bpeTokenMap})
 * const text = decoder.decode(tokens)
 * ```
 */
export class BytePairDecoder {
  constructor(protected _bpe: BytePairEncoding, protected _textDecoder = new TextDecoder()) {}

  /**
   * Converts a list of tokens into a string.
   *
   * ```ts
   * const tokens = [5211, 290, 305, 2340, 4320, 286, 5186, 15900, 30]
   * const text = decoder.decode(tokens)
   * console.log(text) // "Do androids dream of electric sheep?"
   * ```
   *
   * @returns The decoded string.
   */
  public decode: TokenDecodeFn = (tokens: number[] | EncoderResult): string => {
    const source = Array.isArray(tokens) ? tokens : tokens.tokens

    const bytePairEncodings = source
      // First, we convert the tokens into BPE...
      .map((token) => this._bpe.tokenMap.tokenToBytePair(token))
      // The pairs combined into a single string to combine the graphemes.
      .join('')

    // We then convert the BPE into UTF-8 by split the string...
    //...into an array of characters to convert the characters into bytes
    const bytes = Array.from(bytePairEncodings, (x) => this._bpe.codePointByteMap.codePointToByte(x))

    // Finally, we convert the bytes into a string.
    const text = this._textDecoder.decode(new Uint8Array(bytes))

    return text
  }
}
