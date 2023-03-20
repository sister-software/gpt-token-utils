/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { ModelFamily, ModelFamilyIDs } from './common.mjs'

export const ChatGPTModelFamily: ModelFamily = {
  familyID: ModelFamilyIDs.ChatGPT,
  tokenLimit: 4096,
  mergeSpaces: 0,
  modelIDs: ['gpt-3.5-turbo-0301', 'gpt-3.5-turbo'],
  preferredModelID: 'gpt-3.5-turbo',
  pricing: {
    usage: 0.002,
    prompt: null,
    completion: null,
    fineTunedTraining: null,
    fineTunedUsage: null,
  },
}
