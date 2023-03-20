/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { EncoderResult } from './EncoderResult.mjs'
import { modelFamiliesMap, ModelFamiliesMapKey, ModelFamily, ModelFamilyIDs, ModelPricingTypes } from './models/mod.mjs'
import { encode, encodeCodex } from './tokenizer/mod.mjs'

export type CostEstimatorInput = string | EncoderResult

export type ICostEstimationResult = Record<ModelPricingTypes, number | null>

export interface NormalizeInputResult {
  modelFamily: ModelFamily
  encodedResults: EncoderResult[]
}

export class CostEstimator {
  static normalizeInput(modelOrFamilyID: ModelFamiliesMapKey, ...inputs: CostEstimatorInput[]): NormalizeInputResult {
    const modelFamily = modelFamiliesMap.get(modelOrFamilyID)
    const encoderFn = modelFamily.familyID === ModelFamilyIDs.CodeDavinci ? encodeCodex : encode

    const encodedResults = inputs.map((input) => {
      if (typeof input === 'string') {
        return encoderFn(input)
      }

      return input
    })

    return {
      modelFamily,
      encodedResults,
    }
  }

  public estimate(modelOrFamilyID: ModelFamiliesMapKey, ...inputs: CostEstimatorInput[]): ICostEstimationResult {
    const { modelFamily, encodedResults } = CostEstimator.normalizeInput(modelOrFamilyID, ...inputs)
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
}
