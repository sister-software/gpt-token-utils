/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { BytePairEncoding } from './BytePairEncoding.mjs'

/**
 * Methods associated with encoding text into a list of tokens.
 */
export interface ITokenEncoder {
  /**
   * Encodes a given string into a list of tokens.
   *
   * ```ts
   * const text = "Do androids dream of electric sheep?"
   * const tokens = encoder.encode(text)
   * console.log(tokens) // [5211, 290, 305, 2340, 4320, 286, 5186, 15900, 30]
   * ```
   *
   * @returns The list of encoded tokens.
   */
  encode(
    /**
     * The string to encode.
     */
    text: string
  ): number[]
}

/**
 * GPT Token Encoder.
 *
 * Generally, you should not need to use this class directly unless you are
 * implementing a custom token encoder.
 *
 * @see {@linkcode TokenDecoder} for the decoder.
 *
 * ```ts
 * const encoder = new BytePairEncoder(bpeTokenMap, ranksMap)
 * const tokens = encoder.encode(encoder)
 * ```
 */
export class BytePairEncoder implements ITokenEncoder {
  constructor(
    protected _bpe: BytePairEncoding,
    protected _textEncoder = new TextEncoder(),
    protected _bpeTokenCache = new Map<string, string>()
  ) {}
  //#region Public Methods

  public encode(text: string): number[] {
    // First, we run the pattern matcher on the text...
    const matchedTextSegments = Array.from(text.matchAll(this._bpe.tokenizationPattern), (x) => x[0])

    // Then we convert the tokens into UTF-8 byte arrays...
    const utf8Tokens = matchedTextSegments.map((textSegment) => {
      // The individual text segments are already UTF-8 encoded, so we can just convert them to byte arrays.
      const asUTF8 = this._textEncoder.encode(textSegment)
      // We then use our byte map to get the Unicode code point for each byte.
      const codePoints = Array.from(asUTF8, (byte) => {
        const codePoint = this._bpe.codePointByteMap.byteToCodePoint(byte)

        return codePoint
      })

      return codePoints.join('')
    })

    // Then we convert the UTF-8 byte arrays into BPE tokens...
    const bytePairEncodingTokens = utf8Tokens.map((token) => this._tokenToBPE(token))
    const tokens = bytePairEncodingTokens.map((bpeToken) => {
      return bpeToken.split(' ').map((bpeToken) => {
        const token = this._bpe.tokenMap.bytePairToToken(bpeToken)

        if (token === undefined) {
          throw new Error(`No token found for BPE token ${bpeToken}`)
        }

        return token
      })
    })

    return tokens.flat()
  }

  /**
   * Merges the pair of characters with the given values in the given word.
   *
   * @param word - An array of individual characters in the word.
   * @param first - The first character in the pair to merge.
   * @param second - The second character in the pair to merge.
   *
   * @returns The word with the pair of characters merged.
   */
  public mergePair(word: string[], first: string, second: string) {
    const newWord: string[] = []
    let i = 0

    while (i < word.length) {
      const j = word.indexOf(first, i)
      if (j === -1) {
        newWord.push(...word.slice(i))
        break
      }
      newWord.push(...word.slice(i, j))
      if (word[j + 1] === second) {
        newWord.push(first + second)
        i = j + 2
      } else {
        newWord.push(first)
        i = j + 1
      }
    }

    return newWord
  }

  /**
   * Returns an array of all possible pairs of adjacent characters in the given word.
   *
   * @param word - An array of individual characters in the word.
   * @returns An array of all possible pairs of adjacent characters in the word.
   */
  public getPairs(word: string[]) {
    const characters = word.slice()
    const pairingsFound: Record<string, boolean> = {}
    const pairs: string[][] = []
    let previousCharacterIndex = 0

    for (let i = 1; i < characters.length; i++) {
      const previousCharacter = characters[previousCharacterIndex]
      const character = characters[i]

      previousCharacterIndex = i

      const pair = [previousCharacter, character]
      const grapheme = pair.join('')

      if (Object.hasOwn(pairingsFound, grapheme)) {
        continue
      }

      pairs.push(pair)
      pairingsFound[grapheme] = true
    }

    return pairs
  }

  //#endregion

  //#region Protected Methods

  /**
   * Applies byte pair encoding (BPE) to the given token using the provided BPE ranks and cache.
   * If the token is already in the cache, returns its value from the cache.
   *
   * @param token - The token to encode using BPE. This is derived from text passed through the `tokenizerPattern` RegExp.
   *
   * @returns The BPE-encoded token.
   */
  protected _tokenToBPE(token: string): string {
    if (this._bpeTokenCache.has(token)) {
      return this._bpeTokenCache.get(token)!
    }

    // Convert the input token to an array of individual characters
    let word = token.split('')

    // Get all possible pairs of characters in the token
    let pairs = this.getPairs(word)

    // Loop until there are no more pairs to merge
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // If there are no pairs, return the original token
      if (!pairs || pairs.length === 0) {
        return token
      }
      // Find the pair with the lowest rank (or highest numeric value if the rank is NaN)
      const minRankPair = this._findMinRankPair(pairs)

      // If no valid pair is found, exit the loop
      if (!minRankPair || minRankPair.length === 0) {
        break
      }

      // Merge the pair with the lowest rank
      const [first, second] = minRankPair

      let newWord: string[] = []
      let i = 0

      while (i < word.length) {
        const j = word.indexOf(first, i)
        if (j === -1) {
          newWord = newWord.concat(word.slice(i))
          break
        }
        newWord = newWord.concat(word.slice(i, j))
        i = j

        if (word[i] === first && i < word.length - 1 && word[i + 1] === second) {
          newWord.push(first + second)
          i = i + 2
        } else {
          newWord.push(word[i])
          i = i + 1
        }
      }

      // Update the word with the merged pair
      word = newWord

      // If the word is reduced to a single character, exit the loop
      if (word.length === 1) {
        break
      }

      // Otherwise, get all possible pairs of characters in the updated word
      pairs = this.getPairs(word)
    }

    // Join the characters in the final word with spaces and return the result
    const result = word.join(' ')

    this._bpeTokenCache.set(token, result)

    return result
  }

  /**
   * Finds the pair with the lowest rank (or highest numeric value if the rank is NaN) in the given array of pairs.
   *
   * @param pairs - An array of pairs of characters.
   * @param bpeRanks - An object containing the BPE ranks for all pairs of characters.
   * @returns The pair with the lowest rank, or null if no valid pair is found.
   */
  protected _findMinRankPair(pairs: string[][]): string[] | null {
    let minPair: string[] | null = null
    let minRank = Infinity

    for (const pair of pairs) {
      const rank = this._bpe.ranksMap.getRank(pair[0], pair[1])
      if (typeof rank !== 'number') {
        continue
      }

      if (rank < minRank) {
        minPair = pair
        minRank = rank
      }
    }

    return minPair || null
  }
  //#endregion
}
