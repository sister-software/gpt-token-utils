/**
 * @copyright Sister Software. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license
 * See LICENSE file in the project root for full license information.
 */

const nodeInspectSymbol = Symbol.for('nodejs.util.inspect.custom')

/**
 * Two-way map of byte values to their corresponding Unicode codepoints.
 */
export class CodePointByteMap {
  /**
   * Maps each byte value to its corresponding Unicode character.
   */
  protected _byteToCodePoint: Map<number, string>
  /**
   * Maps each Unicode character to its corresponding byte value.
   */
  protected _codePointToByte: Map<string, number>

  constructor() {
    // Contains all the byte values corresponding to printable ASCII characters
    const basicBytes = Array.from({ length: 94 }, (_, i) => i + 33)

    // Contains all the byte values corresponding to extended ASCII characters
    // that are not already included in `basicBytes`
    const extendedBytes = [
      ...Array.from({ length: 12 }, (_, i) => i + 161),
      ...Array.from({ length: 82 }, (_, i) => i + 174),
    ]

    // Combine `basicBytes` and `extendedBytes` to get a list of all byte values
    const allBytes = basicBytes.concat(extendedBytes)
    const cs = allBytes.slice()

    let unicodeIndex = 0

    // Then assign unique Unicode characters to the bytes in `allBytes` that are not
    // already in `basicBytes` or `extendedBytes`...
    // For each possible byte value (0-255)...
    for (let byteValue = 0; byteValue < 256; byteValue++) {
      // If the byte value is not in `allBytes`, it needs to be added to the dictionary
      if (!allBytes.includes(byteValue)) {
        // Add the byte value to `allBytes`
        allBytes.push(byteValue)

        cs.push(256 + unicodeIndex)

        // Increment `unicodeIndex` so the next new byte value will get a unique Unicode character
        unicodeIndex++
      }
    }

    this._byteToCodePoint = new Map()
    this._codePointToByte = new Map()

    for (let i = 0; i < cs.length; i++) {
      const key = allBytes[i]
      const value = String.fromCharCode(cs[i])

      this._byteToCodePoint.set(key, value)
      this._codePointToByte.set(value, key)
    }
  }

  public byteToCodePoint(byte: number): string {
    const codePoint = this._byteToCodePoint.get(byte)

    if (typeof codePoint === 'undefined') {
      throw new Error(`Byte "${byte}" was not found in the byte map.`)
    }

    return codePoint
  }

  public codePointToByte(codePoint: string): number {
    const byte = this._codePointToByte.get(codePoint)

    if (typeof byte === 'undefined') {
      throw new Error(`Unicode character "${codePoint}" was not found in the byte map.`)
    }

    return byte
  }

  public get size() {
    return this._byteToCodePoint.size
  }

  public get byteToCodePointMap() {
    return this._byteToCodePoint
  }

  public get codePointToByteMap() {
    return this._codePointToByte
  }

  [nodeInspectSymbol]() {
    return `CodePointByteMap(${this.size})`
  }
}
