/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { TokenEncodingsRecord } from '../BytePairTokenMap.mjs'
import { BPEVocab, VocabEntry } from '../RanksMap.mjs'

/**
 * Parses a BPE file into a list of bigrams
 *
 * The vocab.bpe file is a text file that contains a set of byte pair encoding (BPE) codes
 * that are used in the tokenization process.
 *
 * The file should be in the following format:
 *
 * ```text
 * #version: VERSION_STRING
 * [prefix1] [suffix1]
 * [prefixN] [suffixN]
 * ...
 * ```
 */
export function parseBPEFile(bpeFileContents: string): BPEVocab {
  const lines = bpeFileContents.trim().split('\n')
  const [versionLine, ...bpeMerges] = lines
  const [version = 'unknown'] = versionLine.trim().match(/^#version: (\d.+)$/) || []

  const entries = bpeMerges.map((line, lineIndex) => {
    const segments = line
      // Each line contains a pair of tokens separated by a space
      .split(/(\s+)/)
      // Clean up the tokens...
      .map((x) => x.trim())
      .filter(Boolean)

    if (segments.length < 2) {
      throw new Error(`Invalid BPE file format: line ${lineIndex + 1} is not a valid bigram`)
    }

    const [prefix, suffix] = segments

    const entry: VocabEntry = {
      prefix,
      suffix,
    }

    return entry
  })

  return {
    version,
    entries,
  }
}

/**
 * Parse a token encoder file, usually from a file named `encoder.json`
 */
export function parseEncoderFile(
  /**
   * The token encoder content, either as a string or as a parsed object.
   */
  tokenEncoderContent: string | TokenEncodingsRecord
): TokenEncodingsRecord {
  const tokenEncodings: TokenEncodingsRecord =
    typeof tokenEncoderContent === 'string' ? JSON.parse(tokenEncoderContent) : tokenEncoderContent

  return tokenEncodings
}
