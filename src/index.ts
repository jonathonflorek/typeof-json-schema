import { JsonArray, JsonObject, JsonValue } from './json';

export type ToInterface<T> = TypeOf<T, { '#': T; [key: string]: unknown }>;
type TypeOf<T, X> =
    T extends { '$ref': infer R } ? ValueOf2<Select<X, R>, X> :
    T extends { allOf: infer R } ? 
        R extends Tuple<1> ? ValueOf2<R[0], X> :
        R extends Tuple<2> ? ValueOf2<R[0], X> & ValueOf2<R[1], X> :
        R extends Tuple<3> ? ValueOf2<R[0], X> & ValueOf2<R[1], X> & ValueOf2<R[2], X> :
        R extends Tuple<4> ? ValueOf2<R[0], X> & ValueOf2<R[1], X> & ValueOf2<R[2], X> & ValueOf2<R[3], X> :
        R extends Tuple<5> ? ValueOf2<R[0], X> & ValueOf2<R[1], X> & ValueOf2<R[2], X> & ValueOf2<R[3], X> & ValueOf2<R[4], X>:
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? ValueOf2<R & T, X> :
    T extends { not: infer R } ? Exclude<JsonObject, ValueOf2<R, X>> :
    ValueOf<T, X>;
type ValueOf2<T, X> =
    T extends { '$ref': infer R } ? ValueOf1<Select<X, R>, X> :
    T extends { allOf: infer R } ? 
        R extends Tuple<1> ? ValueOf1<R[0], X> :
        R extends Tuple<2> ? ValueOf1<R[0], X> & ValueOf1<R[1], X> :
        R extends Tuple<3> ? ValueOf1<R[0], X> & ValueOf1<R[1], X> & ValueOf1<R[2], X> :
        R extends Tuple<4> ? ValueOf1<R[0], X> & ValueOf1<R[1], X> & ValueOf1<R[2], X> & ValueOf1<R[3], X> :
        R extends Tuple<5> ? ValueOf1<R[0], X> & ValueOf1<R[1], X> & ValueOf1<R[2], X> & ValueOf1<R[3], X> & ValueOf1<R[4], X>:
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? ValueOf1<R & T, X> :
    T extends { not: infer R } ? Exclude<JsonObject, ValueOf1<R, X>> :
    ValueOf<T, X>;
type ValueOf1<T, X> =
    T extends { '$ref': infer R } ? ValueOf<Select<X, R>, X> :
    T extends { allOf: infer R } ?
        R extends Tuple<1> ? ValueOf<R[0], X> :
        R extends Tuple<2> ? ValueOf<R[0], X> & ValueOf<R[1], X> :
        R extends Tuple<3> ? ValueOf<R[0], X> & ValueOf<R[1], X> & ValueOf<R[2], X> :
        R extends Tuple<4> ? ValueOf<R[0], X> & ValueOf<R[1], X> & ValueOf<R[2], X> & ValueOf<R[3], X> :
        R extends Tuple<5> ? ValueOf<R[0], X> & ValueOf<R[1], X> & ValueOf<R[2], X> & ValueOf<R[3], X> & ValueOf<R[4], X>:
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? ValueOf<R & T, X> :
    T extends { not: infer R } ? Exclude<JsonObject, ValueOf<R, X>> :
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
                R extends readonly (infer I)[] ? (
                    R extends Tuple<1> ? { 0: TypeOf<R[0], X> } :
                    R extends Tuple<2> ? { 0: TypeOf<R[0], X>; 1: TypeOf<R[1], X> } :
                    R extends Tuple<3> ? { 0: TypeOf<R[0], X>; 1: TypeOf<R[1], X>; 2: TypeOf<R[2], X> } :
                    R extends Tuple<4> ? { 0: TypeOf<R[0], X>; 1: TypeOf<R[1], X>; 2: TypeOf<R[2], X>; 3: TypeOf<R[3], X> } :
                    R extends Tuple<5> ? { 0: TypeOf<R[0], X>; 1: TypeOf<R[1], X>; 2: TypeOf<R[2], X>; 3: TypeOf<R[3], X>; 4: TypeOf<R[4], X> } :
                    unknown
                ) & (
                    T extends { additionalItems: false } ? ArrayOf<I, X> & Pick<R, 'length'> : JsonArray
                ) :
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
    K extends Tuple<0> ? T :
    K extends Tuple<1> ? T [K[0]] :
    K extends Tuple<2> ? T [K[0]] [K[1]] :
    K extends Tuple<3> ? T [K[0]] [K[1]] [K[2]] :
    K extends Tuple<4> ? T [K[0]] [K[1]] [K[2]] [K[3]] :
    K extends Tuple<5> ? T [K[0]] [K[1]] [K[2]] [K[3]] [K[4]] :
    unknown;

type Tuple<N> = readonly any[] & { length: N }

const schema = {
    definitions: {
        id: { type: 'number' },
        recursive: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                values: {
                    type: 'array',
                    items: {
                        '$ref': ['#', 'definitions', 'recursive'],
                    },
                },
            },
            required: ['name', 'values'],
            additionalProperties: false,
        },
    },
    type: 'object',
    properties: {
        sample: {
            type: 'number',
            anyOf: [
                { const: 'hello' },
                { const: 'world' },
                { const: 'test' },
            ],
        },
        id: { type: 'string' },
        name: { type: 'string' },
        value: { type: 'number' },
        other: {
            anyOf: [{
                type: 'string',
            }, {
                type: 'number',
            }]
        },
        thing: {
            type: ['boolean', 'null'],
        },
        enum: {
            enum: ['a', 'b', null, true, 4],
        },
        rec: {
            '$ref': ['#', 'definitions', 'recursive'],
        },
        all: {
            allOf: [{
                type: 'object',
                properties: {
                    name: { type: 'number' },
                },
                required: ['name'],
            }, {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
                required: ['id'],
            }]
        },
        array: {
            type: 'array',
            items: [{
                type: 'string',
                format: 'date'
            }, {
                type: 'number',
            }],
            additionalItems: false,
        },
        array2: {
            type: 'array',
            items: {
                type: 'boolean',
            },
        }
    },
    required: ['id', 'name', 'other'],
    additionalProperties: false,
} as const;

type Schema = ToInterface<typeof schema>;
const value: Schema = {
    id: 'a',
    name: 'c',
    other: '',
    all: {
        name: 43,
        id: '',
    },
    thing: null,
    rec: {
        name: '',
        values: [{
            name: '',
            values: [{
                name: '',
                values: [{
                    name: '',
                    values: [{
                        name: '',
                        values: []
                    }]
                }]
            }]
        }]
    },
    array: ['', 4],
    array2: [true, false, true]
};
