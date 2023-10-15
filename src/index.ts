import { existsSync, readFileSync } from 'fs';

export interface PmfConfig {
    delimiter: string
    shape?: object
}

export function parseMyFile(filepath: string, config: PmfConfig) {
    const fileExists = existsSync(filepath)
    if (!fileExists) throw new Error(`Provided file path doesn't exist: ${filepath}`)

    const fileString = readFileSync(filepath).toString()
    
    const lines = fileString.split('\n')
    const header = lines[0]
    const headerSegments = header.split(config.delimiter).map((w: string) => w.trim())
    const parseKey = {} as { [key: string]: number }

    if (config.shape) {
        const entries = Object.entries(config.shape)
        for (let entry of entries) {
            parseKey[entry[0]] = headerSegments.indexOf(entry[1])
        }
    } else {
        headerSegments.forEach((hs, i) => {
            parseKey[hs] = i
        })
    }

    const result = []
    for (let i = 1; i < lines.length; ++i) {
        const lineString = lines[i]
        if (!lineString) continue

        result.push(parseLine(lineString, parseKey, config))
    }

    return result
}

function parseLine(lineString: string, parseKey: any, config: PmfConfig) {
    const lineSegments = lineString.split(config.delimiter)

    let result = Object.assign({}, parseKey)

    const entries = Object.entries(parseKey)
    for (let entry of entries) {
        result[entry[0]] = lineSegments[entry[1] as number].trim()
    }

    return result
}