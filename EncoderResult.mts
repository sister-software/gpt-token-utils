/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { BytePairEncoder } from './BytePairEncoder.mjs'

const nodeInspectSymbol = Symbol.for('nodejs.util.inspect.custom')
const supportsSegmenter = typeof Intl !== 'undefined' && typeof Intl.Segmenter !== 'undefined'

export interface IEncoderResult {
  /**
   * The tokens that were encoded.
   */
  readonly tokens: number[]
  /**
   * The BPE token pairs that were used during encoded.
   */
  readonly bpeTokenPairs: string[]

  /**
   * The original text content that was encoded.
   */
  readonly originalInput: string

  /**
   * The matched text segments found during encoding.
   */
  readonly matchedTextSegments: string[]
}

/**
 * The `EncoderResult` includes information for post-encoding analysis such as...
 *
 * - The tokens that were encoded.
 * - The BPE token pairs that were used during encoded.
 * - Two-way maps of tokens to BPE token pairs.
 *
 * This information can be used to analyze the encoding process and to
 * reconstruct the original string from the encoded tokens.
 *
 * Note that this object is considered immutable. Consider encoding a new string
 * if you need an updated `EncoderResult`.
 *
 * @see {@linkcode BytePairEncoder}
 */
export class EncoderResult implements IEncoderResult {
  /**
   * A map of BPE token pairs to the corresponding token.
   */
  public tokenBPEMap: ReadonlyMap<number, string>
  /**
   * A map of tokens to the corresponding BPE token pair.
   */
  public bpeTokenMap: ReadonlyMap<string, number>

  /**
   * A map of BPE token pairs to the number of times they were used during encoding.
   * The key is the BPE token pair and the value is the number of times it appeared.
   */
  public bpeCountsMap: ReadonlyMap<string, number>

  /**
   * A map of tokens to the number of times they were used during encoding.
   * The key is the token and the value is the number of times it appeared.
   */
  public tokenCountsMap: ReadonlyMap<number, number>

  public readonly tokens: number[]
  public readonly bpeTokenPairs: string[]
  public readonly originalInput: string
  public readonly matchedTextSegments: string[]

  public segmenter: Intl.Segmenter | undefined

  constructor({ tokens, bpeTokenPairs, originalInput, matchedTextSegments }: IEncoderResult, locale?: string) {
    if (bpeTokenPairs.length !== tokens.length) {
      throw new Error('The number of BPE token pairs must match the number of tokens.')
    }

    const tokenToBPE: Array<[number, string]> = []
    const BPEToToken: Array<[string, number]> = []

    const tokenCountsMap = new Map<number, number>()
    const bpeCountsMap = new Map<string, number>()

    for (let i = 0; i < bpeTokenPairs.length; i++) {
      const token = tokens[i]
      const bpeTokenPair = bpeTokenPairs[i]

      const tokenCount = tokenCountsMap.get(token) || 0
      const bpeCount = bpeCountsMap.get(bpeTokenPair) || 0

      tokenCountsMap.set(token, tokenCount + 1)
      bpeCountsMap.set(bpeTokenPair, bpeCount + 1)

      tokenToBPE.push([token, bpeTokenPair])
      BPEToToken.push([bpeTokenPair, token])
    }

    this.tokenBPEMap = new Map(tokenToBPE)
    this.bpeTokenMap = new Map(BPEToToken)

    this.tokenCountsMap = tokenCountsMap
    this.bpeCountsMap = bpeCountsMap

    this.tokens = tokens
    this.bpeTokenPairs = bpeTokenPairs
    this.originalInput = originalInput
    this.matchedTextSegments = matchedTextSegments

    if (supportsSegmenter) {
      this.segmenter = new Intl.Segmenter(locale)
    }
  }

  /**
   * Get the encoded byte-pair for a given token.
   */
  public getBPE(token: number) {
    return this.tokenBPEMap.get(token)
  }

  /**
   * Get the number of times a given token appeared during encoding.
   * @see {@linkcode EncoderResult.length} if you're just trying count number of tokens.
   */
  public getTokenCount(token: number): number {
    return this.tokenCountsMap.get(token) || 0
  }

  /**
   * Get the number of times a given byte-pair appeared during encoding.
   */
  public getBPECount(bpe: string): number {
    return this.bpeCountsMap.get(bpe) || 0
  }

  /**
   * Iterate over the tokens in the result.
   */
  public [Symbol.iterator]() {
    return this.tokens[Symbol.iterator]()
  }

  /**
   * The number of tokens in the result.
   */
  public get length() {
    return this.tokens.length
  }

  /**
   * The number of characters in the original text.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter Intl.Segmenter}
   */
  public get characterCount(): number {
    if (!this.segmenter) {
      console.warn('Intl.Segmenter is not supported. Falling back to string length.')
      return this.originalInput.length
    }

    return Array.from(this.segmenter.segment(this.originalInput)).length
  }

  public [nodeInspectSymbol]() {
    return `EncoderResult(${this.length})`
  }

  public toString() {
    return this[Symbol.iterator]().toString()
  }

  public toJSON(): IEncoderResult {
    return {
      tokens: this.tokens,
      bpeTokenPairs: this.bpeTokenPairs,
      originalInput: this.originalInput,
      matchedTextSegments: this.matchedTextSegments,
    }
  }
}
