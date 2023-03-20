/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

/**
 * The IDs of available model families.
 */
export const enum ModelFamilyIDs {
  Ada = 'ada',
  Babbage = 'babbage',
  Curie = 'curie',
  Davinci = 'davinci',
  CodeDavinci = 'code-davinci',
  ChatGPT = 'chat-gpt',
  GPT4 = 'gpt-4',
  GPT4_32K = 'gpt-4-32k',
}

/**
 * A model family is a group of models that share a common lineage or training data.
 */
export interface ModelFamily {
  familyID: ModelFamilyIDs
  /**
   * The number of tokens that can be used with this model in a single request.
   */
  tokenLimit: number
  /**
   * The number of spaces to merge into a single token.
   *
   * Codex models use a different set of encodings that handle whitespace more efficiently.
   */
  mergeSpaces: number
  pricing: ModelPricing
  /**
   * The IDs of available models, matches the IDs used in the OpenAI API.
   */
  modelIDs: string[]

  /**
   * The ID of the preferred model in this family.
   */
  preferredModelID?: string
}

export type ModelPricingTypes = 'usage' | 'fineTunedUsage' | 'fineTunedTraining' | 'prompt' | 'completion'
/**
 * The pricing of a model in US dollars.
 * @see https://openai.com/pricing
 */
export interface ModelPricing {
  /**
   * The price of model usage per 1000 tokens.
   */
  usage: number | null
  /**
   * The price of fine-tuned model usage per 1000 tokens.
   */
  fineTunedUsage: number | null
  /**
   * The price of fine-tuned model training per 1000 tokens.
   */
  fineTunedTraining: number | null
  /**
   * The price of usage for the prompt endpoint per 1000 tokens.
   */
  prompt: number | null
  /**
   * The price of usage for the completion endpoint per 1000 tokens.
   */
  completion: number | null
}

export type ModelFamiliesMapKey = ModelFamilyIDs | string

export class ModelFamiliesMap {
  protected _familyMap = new Map<ModelFamilyIDs, ModelFamily>()
  protected _modelToFamilyMap = new Map<string, ModelFamily>()

  public addFamily(family: ModelFamily): void {
    this._familyMap.set(family.familyID, family)
    for (const modelID of family.modelIDs) {
      this._modelToFamilyMap.set(modelID, family)
    }
  }

  public getFamilyByFamilyID(familyID: ModelFamilyIDs): ModelFamily | undefined {
    return this._familyMap.get(familyID)
  }

  public getFamilyByModelID(modelID: string): ModelFamily | undefined {
    return this._modelToFamilyMap.get(modelID)
  }

  public get(modelOrFamilyID: ModelFamiliesMapKey): ModelFamily {
    const family =
      this.getFamilyByFamilyID(modelOrFamilyID as ModelFamilyIDs) || this.getFamilyByModelID(modelOrFamilyID as string)

    if (!family) {
      throw new Error(`No model ID or family found with ID: ${modelOrFamilyID}`)
    }

    return family
  }

  public isModelInFamily(modelID: string, familyID: ModelFamilyIDs): boolean {
    const family = this.getFamilyByFamilyID(familyID)

    return family?.modelIDs.includes(modelID) ?? false
  }
}
