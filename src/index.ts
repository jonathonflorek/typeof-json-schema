import { JsonArray, JsonObject, JsonValue } from './json';

const fix = (key: string, value: any) => key === '$ref' && Array.isArray(value) ? value.join('/') : value;

export type GetValue<T, Ext extends {} = {}> = TypeOf<T, { '#': T } & Ext>;
export type GetDefinitions<T extends {definitions: any}, Ext extends {} = {}> = {
    [K in keyof T['definitions']]: TypeOf<T['definitions'][K], { '#': T } & Ext>;
};

export type TypeOf<T, X> =
    T extends { $ref: infer R } ?
        R extends readonly ['#', ...any[]] ? ValueOf2<Select<X, R>, X> :
        Select<X, R> :
    T extends { allOf: infer R } ? 
        R extends Tuple<1> ? ValueOf2<R[0], X> :
        R extends Tuple<2> ? ValueOf2<R[0], X> & ValueOf2<R[1], X> :
        R extends Tuple<3> ? ValueOf2<R[0], X> & ValueOf2<R[1], X> & ValueOf2<R[2], X> :
        R extends Tuple<4> ? ValueOf2<R[0], X> & ValueOf2<R[1], X> & ValueOf2<R[2], X> & ValueOf2<R[3], X> :
        R extends Tuple<5> ? ValueOf2<R[0], X> & ValueOf2<R[1], X> & ValueOf2<R[2], X> & ValueOf2<R[3], X> & ValueOf2<R[4], X>:
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? ValueOf2<R & T, X> :
    ValueOf<T, X>;
type ValueOf2<T, X> =
    T extends { $ref: infer R } ?
    R extends readonly ['#', ...any[]] ? ValueOf1<Select<X, R>, X> :
    Select<X, R> :
    T extends { allOf: infer R } ?
        R extends Tuple<1> ? ValueOf1<R[0], X> :
        R extends Tuple<2> ? ValueOf1<R[0], X> & ValueOf1<R[1], X> :
        R extends Tuple<3> ? ValueOf1<R[0], X> & ValueOf1<R[1], X> & ValueOf1<R[2], X> :
        R extends Tuple<4> ? ValueOf1<R[0], X> & ValueOf1<R[1], X> & ValueOf1<R[2], X> & ValueOf1<R[3], X> :
        R extends Tuple<5> ? ValueOf1<R[0], X> & ValueOf1<R[1], X> & ValueOf1<R[2], X> & ValueOf1<R[3], X> & ValueOf1<R[4], X>:
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? ValueOf1<R & T, X> :
    ValueOf<T, X>;
type ValueOf1<T, X> =
    T extends { $ref: infer R } ?
    R extends readonly ['#', ...any[]] ? ValueOf<Select<X, R>, X> :
    Select<X, R> :
    T extends { allOf: infer R } ?
        R extends Tuple<1> ? ValueOf<R[0], X> :
        R extends Tuple<2> ? ValueOf<R[0], X> & ValueOf<R[1], X> :
        R extends Tuple<3> ? ValueOf<R[0], X> & ValueOf<R[1], X> & ValueOf<R[2], X> :
        R extends Tuple<4> ? ValueOf<R[0], X> & ValueOf<R[1], X> & ValueOf<R[2], X> & ValueOf<R[3], X> :
        R extends Tuple<5> ? ValueOf<R[0], X> & ValueOf<R[1], X> & ValueOf<R[2], X> & ValueOf<R[3], X> & ValueOf<R[4], X>:
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? ValueOf<R & T, X> :
    ValueOf<T, X>;
type ValueOf<T, X> =
    T extends true ? JsonValue :
    T extends false ? never :
    T extends { const: infer C } ? C :
    T extends { enum: readonly (infer R)[] } ? R :
    T extends { type: readonly (infer R)[] } ?
        R extends keyof Simple ? Simple[R] :
        never :
    T extends { type: infer R } ?
        R extends keyof Simple ? Simple[R] :
        R extends 'object' ?
            T extends { properties: infer P } ? (
                T extends { required: readonly (infer R)[] } ? {
                    [K in keyof P & R]: TypeOf<P[K], X>;
                } & {
                    [K in Exclude<keyof P, R>]?: TypeOf<P[K], X>;
                } : {
                    [K in keyof P]?: TypeOf<P[K], X>;
                }
            ) & (
                T extends { additionalProperties: false } ? unknown : JsonObject
            ) :
            T extends { additionalProperties: infer P } ? {
                [K in string]?: TypeOf<P, X>;
            } :
            JsonObject :
        R extends 'array' ?
            T extends { items: infer R } ? 
                R extends readonly (infer I)[] ?
                { [K in Exclude<keyof R, keyof any[]>]: TypeOf<R[K], X> } &
                ( T extends { additionalItems: false } ? ArrayOf<I, X> & Pick<R, 'length'> : JsonArray ) :
                ArrayOf<R, X> :
            JsonArray :
        never :
    JsonValue;
interface Simple {
    string: string;
    number: number;
    integer: number;
    boolean: boolean;
    null: null;
}
interface ArrayOf<T, X> extends Array<TypeOf<T, X>> {}

type Select<T, K> =
    K extends keyof T ? T [K] :
    K extends Tuple<0> ? T :
    K extends Tuple<1> ? T [K[0]] :
    K extends Tuple<2> ? T [K[0]] [K[1]] :
    K extends Tuple<3> ? T [K[0]] [K[1]] [K[2]] :
    K extends Tuple<4> ? T [K[0]] [K[1]] [K[2]] [K[3]] :
    K extends Tuple<5> ? T [K[0]] [K[1]] [K[2]] [K[3]] [K[4]] :
    unknown;

type Tuple<N> = readonly any[] & { length: N }

const schema = {
    type: 'array',
    items: [
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
    ],
} as const;
type schema = GetValue<typeof schema>;

const metaSchema = {
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
        // if object
        additionalItems: { $ref: '#' },
        items: {
            anyOf: [
                { $ref: '#' },
                { $ref: ['#', 'definitions', 'schemaArray'] }
            ]
        },
        // if array
        required: { $ref: ['#', 'definitions', 'stringArray'] },
        additionalProperties: { $ref: '#' },
        properties: {
            type: 'object',
            additionalProperties: { $ref: '#' }
        }
    }
} as const;

type xxx<T> = T extends 'object' | readonly 'object'[] ? true : false;
type abc = xxx<['string', 'object']>

// x extends 'object' || readonly ['object', ...any[]] ? : never

type ValueOfX<T, X> =
    T extends true ? JsonValue :
    T extends false ? never :
    T extends { const: infer C } ? C :
    T extends { enum: readonly (infer R)[] } ? R :
    T extends { type: infer R } ? 
        never : // (R extends 'object') : 
    JsonValue;

// [K in Exclude<keyof R, keyof any[]]: { [K]: TypeOf<R[K], X> }
