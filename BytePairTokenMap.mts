/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

/**
 * A map of byte-pair encodings to their corresponding tokens.
 * @internal
 */
export type TokenEncodingsRecord = Record<string, number | undefined>

const nodeInspectSymbol = Symbol.for('nodejs.util.inspect.custom')

/**
 * Two-way map between Unicode byte-pairs and tokens.
 * @internal
 */
export class BytePairTokenMap {
  protected _bpeTokenMap: Map<
    /**
     * Byte paired character(s), e.g. `'!'`, `'\u00a8'`
     */
    string,
    /**
     * The corresponding token, e.g. `0`, `101`
     */
    number
  >
  protected _tokenBPEMap: Map<
    /**
     * The corresponding token, e.g. `0`, `101`
     */
    number,
    /**
     * Byte paired character(s), e.g. `'!'`, `'\u00a8'`
     */
    string
  >

  constructor(tokenEncodings: TokenEncodingsRecord, nMergedSpaces = 0) {
    this._bpeTokenMap = new Map()
    this._tokenBPEMap = new Map()

    for (const [key, value] of Object.entries(tokenEncodings)) {
      this.addBytePair(key, value!)
    }

    // add merged spaces for codex tokenizer
    const normalizeVocabLength = this._bpeTokenMap.size + nMergedSpaces

    for (let i = 0; i < nMergedSpaces; i++) {
      const key = '\u0120'.repeat(i + 2)
      const value = normalizeVocabLength - nMergedSpaces + i

      this.addBytePair(key, value)
    }
  }

  public addBytePair(bytePair: string, token: number): void {
    this._bpeTokenMap.set(bytePair, token)
    this._tokenBPEMap.set(token, bytePair)
  }

  public tokenToBytePair(token: number): string {
    const bytePair = this._tokenBPEMap.get(token)

    if (typeof bytePair === 'undefined') {
      throw new Error(`Token "${token}" was not found in the token encoder.`)
    }

    return bytePair
  }

  public bytePairToToken(bytePair: string): number {
    const token = this._bpeTokenMap.get(bytePair)

    if (typeof token === 'undefined') {
      throw new Error(`Byte pair "${bytePair}" was not found in the token encoder.`)
    }

    return token
  }

  public get size() {
    return this._bpeTokenMap.size
  }

  public [nodeInspectSymbol]() {
    return `BytePairTokenMap(${this.size})`
  }
}
