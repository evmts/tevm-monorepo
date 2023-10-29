import { file } from './bunFile.js'
import { bunFileAccesObject } from './bunFileAccessObject.js'
import * as fsPromises from 'fs/promises'
import { join } from 'path'
import { type Mock, beforeEach, describe, expect, it } from 'vitest'
import { vi } from 'vitest'

const licensePath = join(__dirname, '../LICENSE')

vi.mock('./bunFile', () => ({
	file: vi.fn(),
}))

const mockFile = file as Mock

describe('bunFileAccessObject', () => {
	beforeEach(() => {
		mockFile.mockImplementation((filePath: string) => ({
			exists: () => true,
			text: () => fsPromises.readFile(filePath, 'utf8'),
		}))
	})
	describe(bunFileAccesObject.readFileSync.name, () => {
		it('reads a file', () => {
			const result = bunFileAccesObject.readFileSync(licensePath, 'utf8')
			expect(result).toMatchInlineSnapshot(`
        "(The MIT License)

        Copyright 2020-2022

        Permission is hereby granted, free of charge, to any person obtaining
        a copy of this software and associated documentation files (the
        \\"Software\\"), to deal in the Software without restriction, including
        without limitation the rights to use, copy, modify, merge, publish,
        distribute, sublicense, and/or sell copies of the Software, and to
        permit persons to whom the Software is furnished to do so, subject to
        the following conditions:

        The above copyright notice and this permission notice shall be
        included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED \\"AS IS\\", WITHOUT WARRANTY OF ANY KIND,
        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
        SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        "
      `)
		})
	})

	describe(bunFileAccesObject.exists.name, () => {
		it('returns true if a file exists', async () => {
			const result = await bunFileAccesObject.exists(licensePath)
			expect(result).toBe(true)
		})
	})

	describe(bunFileAccesObject.readFile.name, () => {
		it('reads a file', async () => {
			const result = await bunFileAccesObject.readFile(licensePath, 'utf8')
			expect(result).toMatchInlineSnapshot(`
        "(The MIT License)

        Copyright 2020-2022

        Permission is hereby granted, free of charge, to any person obtaining
        a copy of this software and associated documentation files (the
        \\"Software\\"), to deal in the Software without restriction, including
        without limitation the rights to use, copy, modify, merge, publish,
        distribute, sublicense, and/or sell copies of the Software, and to
        permit persons to whom the Software is furnished to do so, subject to
        the following conditions:

        The above copyright notice and this permission notice shall be
        included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED \\"AS IS\\", WITHOUT WARRANTY OF ANY KIND,
        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
        SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        "
      `)
		})
	})

	describe(bunFileAccesObject.existsSync.name, () => {
		it('returns true if a file exists', () => {
			const result = bunFileAccesObject.existsSync(licensePath)
			expect(result).toBe(true)
		})
	})
})
