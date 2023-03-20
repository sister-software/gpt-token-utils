/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { ModelFamily, ModelFamilyIDs } from './common.mjs'

export const GPT4_8KModelFamily: ModelFamily = {
  familyID: ModelFamilyIDs.GPT4,
  tokenLimit: 8192,
  mergeSpaces: 0,
  modelIDs: ['gpt-3.5-turbo', 'gpt-3.5-turbo-0301'],
  preferredModelID: 'gpt-3.5-turbo',
  pricing: {
    prompt: 0.03,
    completion: 0.06,
    usage: null,
    fineTunedTraining: null,
    fineTunedUsage: null,
  },
}

export const GPT4_32KModelFamily: ModelFamily = {
  familyID: ModelFamilyIDs.GPT4,
  tokenLimit: 32768,
  mergeSpaces: 0,
  modelIDs: ['gpt-4-32k', 'gpt-4-32k-0314'],
  preferredModelID: 'gpt-4-32k',
  pricing: {
    prompt: 0.06,
    completion: 0.12,
    usage: null,
    fineTunedTraining: null,
    fineTunedUsage: null,
  },
}
