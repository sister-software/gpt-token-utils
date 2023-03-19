/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

const nodeInspectSymbol = Symbol.for('nodejs.util.inspect.custom')

/**
 * Map of byte-pair encodings according to their BPE rank
 * @internal
 */
export class RanksMap {
  protected _prefixToSuffixRankMap: Map<
    /** Prefix */
    string,
    Map<
      /** Suffix */
      string,
      /** Rank */
      number
    >
  > = new Map()

  public getRank(prefix: string, suffix: string): number | undefined {
    const suffixMap = this._prefixToSuffixRankMap.get(prefix)

    if (suffixMap) {
      return suffixMap.get(suffix)
    }
  }

  constructor(vocab: VocabEntry[] | BPEVocab, mergesSpacesCount = 0) {
    const normalizedVocab = Array.isArray(vocab) ? vocab.slice() : vocab.entries.slice()

    if (mergesSpacesCount > 0) {
      for (let i = 1; i < mergesSpacesCount; i++) {
        for (let j = 1; j < mergesSpacesCount; j++) {
          if (i + j <= mergesSpacesCount) {
            normalizedVocab.push({
              prefix: '\u0120'.repeat(i),
              suffix: '\u0120'.repeat(j),
            })
          }
        }
      }
    }

    for (const [rank, entry] of normalizedVocab.entries()) {
      let suffixMap = this._prefixToSuffixRankMap.get(entry.prefix)

      if (!suffixMap) {
        suffixMap = new Map<string, number>()
        this._prefixToSuffixRankMap.set(entry.prefix, suffixMap)
      }

      suffixMap.set(entry.suffix, rank)
    }
  }

  public get size() {
    return this._prefixToSuffixRankMap.size
  }

  [nodeInspectSymbol]() {
    return `RanksMap(${this.size})`
  }
}

/**
 * A parsed vocabulary entry.
 * The rank of the byte-pair encoding is derived from the index of the pair in the `vocab.bpe` file.
 */
export interface VocabEntry {
  /** The word stem prefix in the pair. */
  prefix: string
  /** The suffix token in the pair. */
  suffix: string
}

/**
 * A vocabulary of byte-pair encodings.
 *
 * @see {@linkcode parseBPEFile}
 */
export interface BPEVocab {
  version: string
  entries: VocabEntry[]
}
