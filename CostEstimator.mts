/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { EncoderInput } from './BytePairEncoder.mjs'
import { EncoderResult } from './EncoderResult.mjs'
import { ModelFamily, ModelFamilyStore, ModelPricingTypes } from './models/mod.mjs'
import { encode } from './tokenizer/mod.mjs'

export type CostEstimatorInput = string | EncoderResult

export type ICostEstimationResult = Record<ModelPricingTypes, number | null>

export interface NormalizeInputResult {
  modelFamily: ModelFamily
  encodedResults: EncoderResult[]
}

export interface EstimateCostFn {
  (modelOrFamilyID: string, ...inputs: EncoderInput[]): ICostEstimationResult
  (modelFamily: ModelFamily, ...inputs: EncoderInput[]): ICostEstimationResult
}

export const estimateCost: EstimateCostFn = (modelInput: string | ModelFamily, ...inputs: EncoderInput[]) => {
  const modelFamily = ModelFamilyStore.get(modelInput)
  const encodedResults = inputs.map((input) => encode(input))
  const tokenCount = encodedResults.reduce((acc, result) => acc + result.tokens.length, 0)

  // Remember that pricing is per 1000 tokens
  const pricedUnits = tokenCount / 1000

  const result = {} as ICostEstimationResult

  for (const [pricingType, pricePer] of Object.entries(modelFamily.pricing)) {
    const price = typeof pricePer === 'number' ? pricePer * pricedUnits : null

    result[pricingType as ModelPricingTypes] = price
  }

  return result
}
