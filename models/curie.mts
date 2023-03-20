/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { ModelFamily, ModelFamilyIDs } from './common.mjs'

export const CurieModelFamily: ModelFamily = {
  familyID: ModelFamilyIDs.Curie,
  tokenLimit: 2049,
  mergeSpaces: 0,
  modelIDs: [
    'curie-instruct-beta',
    'curie-search-document',
    'curie-search-query',
    'curie-similarity',
    'curie:2020-05-03',
    'curie',
    'if-curie-v2',
    'text-curie-001',
    'text-curie:001',
    'text-search-curie-doc-001',
    'text-search-curie-query-001',
    'text-similarity-curie-001',
  ],
  pricing: {
    usage: 0.002,
    prompt: 0.002,
    completion: 0.002,
    fineTunedTraining: 0.003,
    fineTunedUsage: 0.012,
  },
}
