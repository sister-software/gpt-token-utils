/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { ModelFamily, ModelFamilyIDs } from './common.mjs'

export const DavinciModelFamily: ModelFamily = {
  familyID: ModelFamilyIDs.Davinci,
  tokenLimit: 2049,
  mergeSpaces: 0,
  modelIDs: [
    'davinci-if:3.0.0',
    'davinci-instruct-beta:2.0.0',
    'davinci-instruct-beta',
    'davinci-search-document',
    'davinci-search-query',
    'davinci-similarity',
    'davinci:2020-05-03',
    'davinci',
    'if-davinci-v2',
    'if-davinci:3.0.0',
    'text-davinci-001',
    'text-davinci-002',
    'text-davinci-003',
    'text-davinci-edit-001',
    'text-davinci-insert-001',
    'text-davinci-insert-002',
    'text-davinci:001',
    'text-search-davinci-doc-001',
    'text-search-davinci-query-001',
    'text-similarity-davinci-001',
  ],
  pricing: {
    usage: 0.02,
    prompt: 0.02,
    completion: 0.02,
    fineTunedTraining: 0.03,
    fineTunedUsage: 0.12,
  },
}

export const CodexDavinciModelFamily: ModelFamily = {
  familyID: ModelFamilyIDs.CodeDavinci,
  tokenLimit: 8001,
  mergeSpaces: 24,
  modelIDs: ['code-davinci-002', 'code-davinci-edit-001'],
  preferredModelID: 'code-davinci-002',
  pricing: {
    usage: 0.02,
    prompt: 0.02,
    completion: 0.02,
    fineTunedTraining: 0.03,
    fineTunedUsage: 0.12,
  },
}

/**
 * Determines if the modelID is a Codex Davinci model.
 * @internal
 */
export function isCodexDavinciModelID(modelID: string): boolean {
  return CodexDavinciModelFamily.modelIDs.includes(modelID)
}
