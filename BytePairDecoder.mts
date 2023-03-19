/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { BytePairEncoding } from './BytePairEncoding.mjs'

/**
 * Methods associated with decoding a list of tokens into a string.
 */
export interface ITokenDecoder {
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
  decode(
    /**
     * The list of tokens to decode.
     */
    tokens: number[]
  ): string
}

/**
 * GPT Token Decoder.
 *
 * Generally, you should not need to use this class directly unless you are
 * implementing a custom token decoder.
 *
 * @see {@linkcode TokenEncoder} for the encoder.
 *
 * ```ts
 * const decoder = new BytePairDecoder({codePointByteMap, bpeTokenMap})
 * const text = decoder.decode(tokens)
 * ```
 */
export class BytePairDecoder implements ITokenDecoder {
  constructor(protected _bpe: BytePairEncoding, protected _textDecoder = new TextDecoder()) {}

  public decode(tokens: number[]): string {
    const bytePairEncodings = tokens
      // First, we convert the tokens into BPE...
      .map((token) => this._bpe.tokenMap.tokenToBytePair(token))
      // The pairs combined into a single string to combine the graphemes.
      .join('')

    // We then convert the BPE into UTF-8 bytes...
    const bytes = bytePairEncodings
      // We then split the string into an array of characters...
      .split('')
      // To convert the characters into bytes
      .map((x) => this._bpe.codePointByteMap.codePointToByte(x))

    // Finally, we convert the bytes into a string.
    const text = this._textDecoder.decode(new Uint8Array(bytes))

    return text
  }
}
