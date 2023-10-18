import path from 'path'
import { parseMyFile } from '../src/index'

describe('parseMyFile', () => {
    describe('when no shape is provided', () => {
        it('should parse my file', () => {
            const result = parseMyFile(path.join(__dirname, 'data/basic.txt'), {
                delimiter: ',',
            })

            expect(result).toStrictEqual([
                {
                    ID: '1',
                    NAME: 'A THING',
                    PRICE: '$0.99',
                    QTY: '5',
                },
            ])
        })
    })

    describe('when a shape is provided', () => {
        it('should parse my file', () => {
            const result = parseMyFile(path.join(__dirname, 'data/basic.txt'), {
                delimiter: ',',
                shape: {
                    id: 'ID',
                    name: 'NAME',
                    price: 'PRICE',
                    quantity: 'QTY',
                },
            })

            expect(result).toStrictEqual([
                {
                    id: '1',
                    name: 'A THING',
                    price: '$0.99',
                    quantity: '5',
                },
            ])
        })
    })
})