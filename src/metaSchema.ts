export const metaSchema = {
    definitions: {
        schemaArray: {
            type: 'array',
            items: { $ref: '#' }
        },
        simpleTypes: {
            enum: [
                'array',
                'boolean',
                'integer',
                'null',
                'number',
                'object',
                'string'
            ]
        },
        stringArray: {
            type: 'array',
            items: { type: 'string' }
        }
    },
    type: ['object', 'boolean'],
    properties: {
        // special
        $ref: {
            anyOf: [
                { type: 'string' },
                { $ref: ['#', 'definitions', 'stringArray'] }
            ]
        },
        // general
        definitions: {
            type: 'object',
            additionalProperties: { $ref: '#' }
        },
        const: true,
        enum: {
            type: 'array',
            items: true,
        },        
        type: {
            anyOf: [
                { $ref: ['#', 'definitions', 'simpleTypes'] },
                { 
                    type: 'array',
                    items: { $ref: ['#', 'definitions', 'simpleTypes'] },
                }
            ]
        },
        allOf: { $ref: ['#', 'definitions', 'schemaArray'] },
        anyOf: { $ref: ['#', 'definitions', 'schemaArray'] },
        // object
        additionalItems: { $ref: '#' },
        items: {
            anyOf: [
                { $ref: '#' },
                { $ref: ['#', 'definitions', 'schemaArray'] }
            ]
        },
        // array
        required: { $ref: ['#', 'definitions', 'stringArray'] },
        additionalProperties: { $ref: '#' },
        properties: {
            type: 'object',
            additionalProperties: { $ref: '#' }
        }
    }
} as const;
