import { existsSync, readFileSync } from 'fs'

export interface PmfConfig<T> {
	delimiter: string
	shape?: T
}

export function parseMyFile<T>(filepath: string, config: PmfConfig<T>): T[] {
	const fileExists = existsSync(filepath)
	if (!fileExists)
		throw new Error(`Provided file path doesn't exist: ${filepath}`)

	const fileString = readFileSync(filepath).toString()

	const lines = fileString.split('\n')
	const header = lines[0]
	const headerSegments = header
		.split(config.delimiter)
		.map((w: string) => w.trim())
	let parseKey = {} as T

	if (config.shape) {
		parseKey = buildParseKey(parseKey, config.shape, headerSegments)
	} else {
		headerSegments.forEach((hs, i) => {
			Object.defineProperty(parseKey, hs, {
				value: i,
				enumerable: true,
			})
		})
	}

	const result: T[] = []
	for (let i = 1; i < lines.length; ++i) {
		const lineString = lines[i]
		if (!lineString) continue

		result.push(parseLine(lineString, parseKey, config))
	}

	return result
}

function buildParseKey<T, K>(
	parseKey: K,
	shape: T,
	headerSegments: string[],
): K {
	for (const key in shape) {
		const value = shape[key]
		console.log(key, value)
		if (typeof value === 'object') {
			Object.defineProperty(parseKey, key, {
				value: buildParseKey({}, value, headerSegments),
				enumerable: true,
			})
		} else if (typeof value === 'string') {
			Object.defineProperty(parseKey, key, {
				value: headerSegments.indexOf(value),
				enumerable: true,
			})
		} else {
			throw new Error(
				'Parse-My-file shape does not accept shape values that are not an object or a string',
			)
		}
		console.log(parseKey)
	}
	return parseKey
}

function parseLine<T, K>(
	lineString: string,
	parseKey: K,
	config: PmfConfig<T>,
): K {
	const lineSegments = lineString.split(config.delimiter)

	console.log('parseLine', parseKey)
	const result: K = Object.assign({}, parseKey)
	for (const key in parseKey) {
		const value = parseKey[key]
		if (typeof value === 'object') {
			Object.defineProperty(result, key, {
				value: parseLine(lineString, value, config),
				enumerable: true,
			})
		} else {
			Object.defineProperty(result, key, {
				value: lineSegments[value as number].trim(),
				enumerable: true,
			})
		}
	}

	return result
}
