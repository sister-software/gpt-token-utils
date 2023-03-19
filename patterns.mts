/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

/**
 * Default contractions used by the tokenizer pattern.
 * Note that order matters here, as the pattern will match the first contraction that matches.
 */
export const DEFAULT_CONTRACTIONS = [
  /** @example "John's" */
  `'s`,
  /** @example "can't" */
  `'t`,
  /** @example "they're" */
  `'re`,
  /** @example "I've" */
  `'ve`,
  /** @example "I'm" */
  `'m`,
  /** @example "they'll" */
  `'ll`,
  /** @example "he'd" */
  `'d`,
] as const satisfies readonly string[]

/**
 * Default tokenizer rules used to build the tokenizer pattern.
 */
export const DEFAULT_TOKENIZER_RULES = [
  /** Matches one or more letters optionally preceded by a space. */
  ' ?\\p{L}+',
  /** Matches one or more digits optionally preceded by a space. */
  ' ?\\p{N}+',
  /** Matches one or more non-space, non-letter, non-digit characters optionally preceded by a space. */
  ' ?[^\\s\\p{L}\\p{N}]+',
  /** Matches one or more spaces that are not followed by a non-space character (i.e. end of word). */
  '\\s+(?!\\S)',
  /** Matches one or more spaces. */
  '\\s+',
] as const satisfies readonly string[]

/**
 * Creates a regular expression pattern used to tokenize text into individual tokens.
 * @param contractions - Contractions used by the tokenizer pattern.
 * @param rules - Rules used to build the tokenizer pattern.
 *
 * @see {@linkcode DEFAULT_TOKENIZER_RULES}
 */
export function createTokenizerPattern(
  contractions: string[] = DEFAULT_CONTRACTIONS.slice(),
  rules: string[] = DEFAULT_TOKENIZER_RULES.slice()
): RegExp {
  const pattern = [...contractions, ...rules].join('|')
  return new RegExp(pattern, 'gu')
}
