/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { expect, test } from 'vitest'
import {
  BytePairEncoder,
  BytePairEncoding,
  CostEstimator,
  createDefaultBPEOptions,
  ICostEstimationResult,
  ModelFamilyIDs,
} from '../mod.mjs'
import { readFixture, TestCase } from './common.mjs'

interface CostEstimatorTestCase extends TestCase<string, ICostEstimationResult> {
  modelID: ModelFamilyIDs
}

const testCases: CostEstimatorTestCase[] = [
  {
    label: 'Empty string',
    modelID: ModelFamilyIDs.Davinci,
    given: '',
    expected: {
      usage: 0,
      fineTunedUsage: 0,
      fineTunedTraining: 0,
      prompt: 0,
      completion: 0,
    },
  },
  {
    label: 'Just a space',
    modelID: ModelFamilyIDs.Davinci,
    given: ' ',
    expected: {
      completion: 0.00002,
      fineTunedTraining: 0.00003,
      fineTunedUsage: 0.00012,
      prompt: 0.00002,
      usage: 0.00002,
    },
  },
  {
    label: 'Tab',
    modelID: ModelFamilyIDs.Davinci,
    given: '\t',
    expected: {
      completion: 0.00002,
      fineTunedTraining: 0.00003,
      fineTunedUsage: 0.00012,
      prompt: 0.00002,
      usage: 0.00002,
    },
  },
  {
    label: 'Single paragraph',
    modelID: ModelFamilyIDs.Davinci,
    given: readFixture('single-paragraph.txt'),
    expected: {
      completion: 0.0031,
      fineTunedTraining: 0.00465,
      fineTunedUsage: 0.0186,
      prompt: 0.0031,
      usage: 0.0031,
    },
  },
  {
    label: 'Multiple paragraphs',
    modelID: ModelFamilyIDs.Davinci,
    given: readFixture('multiple-paragraphs.txt'),
    expected: {
      completion: 0.01434,
      fineTunedTraining: 0.021509999999999998,
      fineTunedUsage: 0.08603999999999999,
      prompt: 0.01434,
      usage: 0.01434,
    },
  },
  {
    label: 'HTML content',
    modelID: ModelFamilyIDs.CodeDavinci,
    given: readFixture('sample-html.html'),
    expected: {
      completion: 0.005659999999999999,
      fineTunedTraining: 0.00849,
      fineTunedUsage: 0.03396,
      prompt: 0.005659999999999999,
      usage: 0.005659999999999999,
    },
  },
]

for (const { label, given, modelID, expected, options } of testCases) {
  test(label, () => {
    const gptEncoding = new BytePairEncoding({ ...createDefaultBPEOptions(), ...options })
    const encoder = new BytePairEncoder(gptEncoding)
    const costEstimator = new CostEstimator()

    const encoded = encoder.encode(given)
    const estimatedCosts = costEstimator.estimate(modelID, encoded)

    expect(estimatedCosts).toEqual(expected)
  })
}
