/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { BytePairTokenMap, TokenEncodingsRecord } from './BytePairTokenMap.mjs'
import { CodePointByteMap } from './CodePointByteMap.mjs'
import { createTokenizerPattern } from './patterns.mjs'
import { BPEVocab, RanksMap, VocabEntry } from './RanksMap.mjs'

export interface IBytePairEncodingOptions {
  /**
   * The token encoder map. This is typically derived from a `encoder.json` file:
   *
   * ```ts
   * const tokenEncodings = parseEncoderFile(fs.readFileSync('./encoder.json', 'utf-8'))
   * ```
   */
  tokenEncodings: TokenEncodingsRecord

  /**
   * The BPE ranks map. This is typically derived from a `vocab.bpe` file:
   *
   * ```ts
   * const vocab = parseBPEFile(fs.readFileSync('./vocab.bpe', 'utf-8'))
   * ```
   *
   * You should only use this option if you are using a custom vocabulary.
   *
   * @see {@linkcode parseBPEFile}
   *
   * @default parseBPEFile(DEFAULT_VOCAB)
   */
  vocab: VocabEntry[] | BPEVocab

  /**
   * The number of spaces to merge into a single token.
   *
   * Codex models use a different set of encodings that handle whitespace more efficiently.
   * @default 'none'
   */
  mergeSpaces?: 'none' | 'codex' | number

  /**
   * Optional override of the regular expression used to tokenize text.
   * @default createTokenizerPattern()
   */
  tokenizationPattern?: RegExp
}

/**
 * A base class for the Byte Pair Encoding (BPE) encoder and decoder.
 * @internal
 */
export class BytePairEncoding {
  public codePointByteMap: CodePointByteMap
  public mergesSpacesCount: number

  public tokenMap: BytePairTokenMap
  public ranksMap: RanksMap

  public tokenizationPattern: RegExp

  constructor(options: IBytePairEncodingOptions) {
    this.tokenizationPattern = options.tokenizationPattern ?? createTokenizerPattern()
    this.codePointByteMap = new CodePointByteMap()

    if (typeof options.mergeSpaces === 'string') {
      this.mergesSpacesCount = options.mergeSpaces === 'codex' ? 30 : 0
    } else {
      this.mergesSpacesCount = options.mergeSpaces ?? 0
    }

    this.tokenMap = new BytePairTokenMap(options.tokenEncodings, this.mergesSpacesCount)
    this.ranksMap = new RanksMap(options.vocab, this.mergesSpacesCount)
  }
}
