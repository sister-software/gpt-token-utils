/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { ModelFamily, ModelFamilyIDs } from './common.mjs'

export const AdaModelFamily: ModelFamily = {
  familyID: ModelFamilyIDs.Ada,
  tokenLimit: 2049,
  mergeSpaces: 0,
  modelIDs: [
    'ada-code-search-code',
    'ada-code-search-text',
    'ada-search-document',
    'ada-search-query',
    'ada-similarity',
    'ada:2020-05-03',
    'ada',
    'code-search-ada-code-001',
    'code-search-ada-text-001',
    'text-ada-001',
    'text-ada:001',
    'text-embedding-ada-002',
    'text-search-ada-doc-001',
    'text-search-ada-query-001',
    'text-similarity-ada-001',
  ],
  pricing: {
    usage: 0.0004,
    prompt: 0.0004,
    completion: 0.0004,
    fineTunedTraining: 0.0004,
    fineTunedUsage: 0.0016,
  },
}
