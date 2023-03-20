/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

import { readFileSync } from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'url'
import { IBytePairEncodingOptions } from '../mod.mjs'

export interface TestCase<G, E> {
  label: string
  given: G
  expected: E
  options?: Partial<IBytePairEncodingOptions>
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixturesPath = path.join(__dirname, 'fixtures')

export function readFixture(fileName: string): string {
  return readFileSync(path.join(fixturesPath, fileName), 'utf8').trim()
}
