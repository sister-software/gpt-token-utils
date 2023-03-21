/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { AdaModelFamily } from './ada.mjs'
import { BabbageModelFamily } from './babbage.mjs'
import { ChatGPTModelFamily } from './chat-gpt.mjs'
import { ModelFamiliesMap } from './common.mjs'
import { CurieModelFamily } from './curie.mjs'
import { DavinciModelFamily } from './davinci.mjs'
import { GPT4_32KModelFamily, GPT4_8KModelFamily } from './gpt-4.mjs'

/**
 * A global store of all model families.
 */
export const ModelFamilyStore = new ModelFamiliesMap()

ModelFamilyStore.addFamily(AdaModelFamily)
ModelFamilyStore.addFamily(BabbageModelFamily)
ModelFamilyStore.addFamily(CurieModelFamily)
ModelFamilyStore.addFamily(DavinciModelFamily)
ModelFamilyStore.addFamily(ChatGPTModelFamily)
ModelFamilyStore.addFamily(GPT4_32KModelFamily)
ModelFamilyStore.addFamily(GPT4_8KModelFamily)

export * from './common.mjs'
