/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { ModelFamily, ModelFamilyIDs } from './common.mjs'

export const BabbageModelFamily: ModelFamily = {
  familyID: ModelFamilyIDs.Babbage,
  tokenLimit: 2049,
  mergeSpaces: 0,
  modelIDs: [
    'babbage-code-search-code',
    'babbage-code-search-text',
    'babbage-search-document',
    'babbage-search-query',
    'babbage-similarity',
    'babbage:2020-05-03',
    'babbage',
    'code-search-babbage-code-001',
    'code-search-babbage-text-001',
    'text-babbage-001',
    'text-babbage:001',
    'text-search-babbage-doc-001',
    'text-search-babbage-query-001',
    'text-similarity-babbage-001',
  ],
  pricing: {
    usage: 0.0005,
    prompt: 0.0005,
    completion: 0.0005,
    fineTunedTraining: 0.0006,
    fineTunedUsage: 0.0024,
  },
}
