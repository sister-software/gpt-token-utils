# What is this?

**GPT Token Utilities** is a small library for encoding and decoding text to and from the tokenized format used by OpenAI's GPT models.

## Why should I use this?

### 🏃‍♀️ Fast

Our token encoder/decoder is optimized for a balance of speed and ease of use. No external dependencies are required.

### 🤸‍♀️ Flexible

Everything is written in TypeScript and includes type definitions with full documentation. This library is isomorphic and can be used in both Node and the browser!

### ⚖️ Light in size. Heavy in features.

GPT Token Utils balances a small footprint with a full-featured API.
It's also tree-shakeable, so you can import only the functions you need.

## Installation

### NPM

```bash
yarn add gpt-token-utils
# or
npm install --save gpt-token-utils
```

## Usage

## Encoding and Decoding Text

The `encode` and `decode` exports are the main functions you'll use to work with GPT tokens.

```js
import { encode, decode } from 'gpt-token-utils'

// Encode a string to a list of tokens...
const tokens = encode('Humans are strange creatures, and ever so curious too!')

// You've got a list of tokens!
console.log(tokens) // [32661, 504, 389, 6283, 8109, 11, 290, 1683, 523, 11040, 1165, 0]

// How many tokens are there?
console.log(tokens.length) // 6

// Can we decode it back to text?
console.log(decode(tokens)) // "Humans are strange creatures...."
```

If you're working with Codex-based models optimized for strings of code, you can also use the `encodeCodex` and `decodeCodex` exports.

```js
import { encodeCodex, decodeCodex } from 'gpt-token-utils'

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

const tokens = encodeCodex(codeExample)
```

### Advanced Usage

By default, GPT Token Utils includes a sizable vocabulary and encoder. Alternatively, you can pass in your own to customize the encoding/decoding process.

```js
import {BytePairEncoder} from 'gpt-token-utils/BytePairEncoder'

const tokenEncoder = new BytePairEncoder({...})
```

```js
import {BytePairDecoder} from 'gpt-token-utils/BytePairDecoder'

const tokenDecoder = new TokenDecoder({...})
```

# License

GPT Token Utils is licensed under the [MIT License](https://opensource.org/licenses/MIT). If you've got something cool to share that's built with this library, let us know at [@SisterSoftware](https://twitter.com/SisterSoftware)! We would love to see it!
