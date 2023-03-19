/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { gptDecoder, gptEncoder } from '../mod.mjs'

const str = 'This is an example sentence to try encoding out on!'
console.log('Encoding...', str)
const encoded = gptEncoder.encode(str)
console.log('Encoded this string looks like: ')

for (const token of encoded) {
  console.log(token)
}

console.log('We can look at each token and what it represents')
for (const token of encoded) {
  console.log({ token, string: gptDecoder.decode([token]) })
}

const decoded = gptDecoder.decode(encoded)
console.log('We can decode it back into:\n', decoded)
