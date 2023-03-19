/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { expect, test } from 'vitest'
import { BytePairDecoder, BytePairEncoder, BytePairEncoding, IBytePairEncodingOptions } from '../mod.mjs'
import { createDefaultBPEOptions } from '../tokenizer/mod.mjs'

interface TestCase {
  label: string
  given: string
  expected: number[]
  options?: Partial<IBytePairEncodingOptions>
}

const codeExample = [
  'function deeplyNested () {',
  '  return {',
  '    the: {',
  '      quick: {',
  '        brown: {',
  '          fox: {',
  '            jumps: {',
  '              over: {',
  '                the: {',
  '                  lazy: {',
  '                    dog: {',
  '                    }',
  '                  }',
  '                }',
  '              }',
  '            }',
  '          }',
  '        }',
  '      }',
  '    }',
  '  }',
  '}',
].join('\n')

const testCases: TestCase[] = [
  {
    label: 'Empty string',
    given: '',
    expected: [],
  },
  {
    label: 'Just a space',
    given: ' ',
    expected: [220],
  },
  {
    label: 'Tab',
    given: '\t',
    expected: [197],
  },
  {
    label: 'Simple text',
    given: 'This is some text',
    expected: [1212, 318, 617, 2420],
  },

  {
    label: 'Text with special characters',
    given: `This is some text with a few special characters: !@#$%^&*()_+-=~[]{}|;:'",./<>?`,
    expected: [
      1212, 318, 617, 2420, 351, 257, 1178, 2041, 3435, 25, 5145, 31, 29953, 4, 61, 5, 9, 3419, 62, 10, 12, 31820,
      21737, 90, 92, 91, 26, 32105, 1600, 19571, 27, 29, 30,
    ],
  },
  {
    label: 'Text with numbers',
    given: 'This is some text with numbers 1234567890',
    expected: [1212, 318, 617, 2420, 351, 3146, 17031, 2231, 30924, 3829],
  },

  {
    label: 'Non-European text',
    given: '你好世界',
    expected: [19526, 254, 25001, 121, 10310, 244, 45911, 234],
  },
  {
    label: 'Bubble text',
    given: 'Ⓗⓔⓛⓛⓞ Ⓑⓤⓑⓑⓛⓔ',
    expected: [
      158, 240, 121, 158, 241, 242, 158, 241, 249, 158, 241, 249, 158, 241, 252, 2343, 240, 115, 158, 241, 97, 158, 241,
      239, 158, 241, 239, 158, 241, 249, 158, 241, 242,
    ],
  },
  {
    label: 'Multi-token word',
    given: 'indivisible',
    expected: [521, 452, 12843],
  },
  {
    label: 'Emojis',
    given: 'hello 👋 world 🌍',
    expected: [31373, 50169, 233, 995, 12520, 234, 235],
  },
  // We include a few properties of Object here to test that the tokenizer
  // doesn't include inherited properties.
  {
    label: 'properties of Object',
    given: 'toString constructor hasOwnProperty valueOf',
    expected: [1462, 10100, 23772, 468, 23858, 21746, 1988, 5189],
  },

  // Codex models use additional tokens for whitespace...
  {
    label: 'Without Codex',
    given: codeExample,
    expected: [
      8818, 7744, 45, 7287, 7499, 1391, 198, 220, 1441, 1391, 198, 220, 220, 220, 262, 25, 1391, 198, 220, 220, 220,
      220, 220, 2068, 25, 1391, 198, 220, 220, 220, 220, 220, 220, 220, 7586, 25, 1391, 198, 220, 220, 220, 220, 220,
      220, 220, 220, 220, 21831, 25, 1391, 198, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 18045, 25, 1391,
      198, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 625, 25, 1391, 198, 220, 220, 220, 220, 220,
      220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 262, 25, 1391, 198, 220, 220, 220, 220, 220, 220, 220, 220, 220,
      220, 220, 220, 220, 220, 220, 220, 220, 16931, 25, 1391, 198, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220,
      220, 220, 220, 220, 220, 220, 220, 220, 220, 3290, 25, 1391, 198, 220, 220, 220, 220, 220, 220, 220, 220, 220,
      220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 1782, 198, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220,
      220, 220, 220, 220, 220, 220, 220, 1782, 198, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220,
      220, 220, 1782, 198, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 220, 1782, 198, 220, 220, 220,
      220, 220, 220, 220, 220, 220, 220, 220, 1782, 198, 220, 220, 220, 220, 220, 220, 220, 220, 220, 1782, 198, 220,
      220, 220, 220, 220, 220, 220, 1782, 198, 220, 220, 220, 220, 220, 1782, 198, 220, 220, 220, 1782, 198, 220, 1782,
      198, 92,
    ],
  },
  // Codex models use additional tokens for whitespace...
  {
    label: 'With Codex',
    given: codeExample,
    expected: [
      8818, 7744, 45, 7287, 7499, 1391, 198, 220, 1441, 1391, 198, 50258, 262, 25, 1391, 198, 50260, 2068, 25, 1391,
      198, 50262, 7586, 25, 1391, 198, 50264, 21831, 25, 1391, 198, 50266, 18045, 25, 1391, 198, 50268, 625, 25, 1391,
      198, 50270, 262, 25, 1391, 198, 50272, 16931, 25, 1391, 198, 50274, 3290, 25, 1391, 198, 50274, 1782, 198, 50272,
      1782, 198, 50270, 1782, 198, 50268, 1782, 198, 50266, 1782, 198, 50264, 1782, 198, 50262, 1782, 198, 50260, 1782,
      198, 50258, 1782, 198, 220, 1782, 198, 92,
    ],
    options: {
      mergeSpaces: 'codex',
    },
  },
]

for (const { label, given, expected, options } of testCases) {
  test(label, () => {
    const gptEncoding = new BytePairEncoding({ ...createDefaultBPEOptions(), ...options })
    const encoder = new BytePairEncoder(gptEncoding)
    const decoder = new BytePairDecoder(gptEncoding)

    const encoded = encoder.encode(given)
    const decoded = decoder.decode(encoded)

    expect(encoded).toEqual(expected)
    expect(decoded).toEqual(given)
  })
}
