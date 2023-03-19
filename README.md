# What is this?

**GPT Token Utilities** is a small library for encoding and decoding text to and from the tokenized format used by OpenAI's GPT models.

## Why should I use this?

### 🏃‍♀️ Fast

Our token encoder/decoder is optimized for a balance of speed and ease of use. No external dependencies are required.

### 🤸‍♀️ Flexible

Everything is written in TypeScript and includes type definitions with full documentation. It's also tree-shakeable, so you can import only the functions you need.

## Installation

### NPM

```bash
yarn add gpt-token-utils
# or
npm install --save gpt-token-utils
```

## Basic Usage

The `gptEncoder` and `gptDecoder` objects are the main entry points for this library. They are isomorphic too, so they can be used in both Node and the browser!

```js
import { gptEncoder, gptDecoder } from 'gpt-token-utils'

const tokens = gptEncoder.encode('Humans are strange creatures.')

console.log(tokens) // [32661, 504, 389, 6283, 8109, 13]

const text = gptDecoder.decode(tokens)

console.log(text) // Humans are strange creatures.
```

## Advanced Usage

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
