/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import type { IBytePairEncodingOptions } from '../BytePairEncoding.mjs'
import { DEFAULT_ENCODER_KEYS, DEFAULT_ENCODER_VALUES } from './encoder.mjs'
import { parseBundledEncoder, parseBundledVocab } from './parsers.mjs'
import { DEFAULT_VOCAB } from './vocab.mjs'

/**
 * @internal
 */
export function createDefaultBPEOptions(): Readonly<IBytePairEncodingOptions> {
  return {
    tokenEncodings: parseBundledEncoder(DEFAULT_ENCODER_KEYS, DEFAULT_ENCODER_VALUES),
    vocab: parseBundledVocab(DEFAULT_VOCAB),
  }
}

/**
 * Default options for byte pair encoding.
 *
 * Note that referencing to this object will incur a filesize penalty when bundling.
 */
export const DEFAULT_BPE_OPTIONS = createDefaultBPEOptions()
