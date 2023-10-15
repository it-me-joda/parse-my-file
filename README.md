# Parse-My-File

## Configuration

```TypeScript
{
    // the character that separates columns
    delimiter: ',',
    // OPTIONAL: the javascript object shape to get from each row
    //// the value of each key is the header value of each column 
    //// if not provided, a basic shape will be provided for you
    shape: {
        id: 'ID',
        name: 'NAME',
        price: 'PRICE',
        quantity: 'QTY'
    }
}
```

## Usage

```csv
ID, NAME, PRICE, QTY
1, A THING, $0.99, 5
```

```TypeScript
import { parseMyFile } from 'parse-my-file'

const result = parseMyFile('test.txt', {
    delimiter: ',',
    shape: {
        id: 'ID',
        name: 'NAME',
        price: 'PRICE',
        quantity: 'QTY',
    }
})

console.log('result', result)
// [ { id: '1', name: 'A THING', price '$0.99', quantity: '5' } ]

// Alternatively, if you choose to not provide a shape
// it will default to using the header value as the keys
// [ { ID: '1', NAME: 'A THING', PRICE: '$0.99', QTY: '5' } ]
```
