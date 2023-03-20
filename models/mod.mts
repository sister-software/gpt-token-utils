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
import { CodexDavinciModelFamily, DavinciModelFamily } from './davinci.mjs'
import { GPT4_32KModelFamily, GPT4_8KModelFamily } from './gpt-4.mjs'

export const modelFamiliesMap = new ModelFamiliesMap()

modelFamiliesMap.addFamily(AdaModelFamily)
modelFamiliesMap.addFamily(BabbageModelFamily)
modelFamiliesMap.addFamily(CurieModelFamily)
modelFamiliesMap.addFamily(CodexDavinciModelFamily)
modelFamiliesMap.addFamily(DavinciModelFamily)
modelFamiliesMap.addFamily(ChatGPTModelFamily)
modelFamiliesMap.addFamily(GPT4_32KModelFamily)
modelFamiliesMap.addFamily(GPT4_8KModelFamily)

export * from './common.mjs'
