/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { TokenEncodingsRecord } from '../BytePairTokenMap.mjs'
import { BPEVocab, VocabEntry } from '../RanksMap.mjs'
import { BundledEncoderKeys, BundledEncoderValues, BundledVocab } from './common.mjs'

/**
 * Parses a bundled vocabulary into a list of bigrams.
 * @internal
 */
export function parseBundledVocab(bundledVocab: BundledVocab): BPEVocab {
  if (bundledVocab.length % 2 !== 0) {
    throw new Error('Invalid bundled vocabulary format: vocab must be an even number of entries')
  }

  const entries: VocabEntry[] = []

  for (let i = 0; i < bundledVocab.length; i += 2) {
    const prefix = bundledVocab[i]
    const suffix = bundledVocab[i + 1]

    entries.push({
      prefix,
      suffix,
    })
  }

  return {
    version: 'bundled',
    entries,
  }
}

/**
 * Parses a bundled encoder into a record.
 * @internal
 */
export function parseBundledEncoder(
  encoderKeys: BundledEncoderKeys,
  encoderValues: BundledEncoderValues
): TokenEncodingsRecord {
  if (encoderKeys.length !== encoderValues.length) {
    throw new Error('Invalid bundled encoder: keys and values are not the same length')
  }

  const tokenEncodings: TokenEncodingsRecord = {}

  for (let i = 0; i < encoderKeys.length; i++) {
    const key = encoderKeys[i]
    const value = encoderValues[i]

    tokenEncodings[key] = value
  }

  return tokenEncodings
}
