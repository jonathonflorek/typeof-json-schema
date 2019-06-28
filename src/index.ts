import { JsonArray, JsonObject, JsonValue } from './json';

export type ToInterface<T> = InterfaceOf<T, { '#': T; [key: string]: unknown }>;
type InterfaceOf<T, X> =
    T extends { '$ref': infer R } ? InterfaceOf2<Select<X, R>, X> :
    T extends { allOf: infer R } ? 
        R extends Tuple<1> ? InterfaceOf2<R[0], X> :
        R extends Tuple<2> ? InterfaceOf2<R[0], X> & InterfaceOf2<R[1], X> :
        R extends Tuple<3> ? InterfaceOf2<R[0], X> & InterfaceOf2<R[1], X> & InterfaceOf2<R[2], X> :
        R extends Tuple<4> ? InterfaceOf2<R[0], X> & InterfaceOf2<R[1], X> & InterfaceOf2<R[2], X> & InterfaceOf2<R[3], X> :
        R extends Tuple<5> ? InterfaceOf2<R[0], X> & InterfaceOf2<R[1], X> & InterfaceOf2<R[2], X> & InterfaceOf2<R[3], X> & InterfaceOf2<R[4], X>:
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? InterfaceOf2<R, X> :
    T extends { not: infer R } ? Exclude<JsonObject, InterfaceOf2<R, X>> :
    ValueOf<T, X>;
type InterfaceOf2<T, X> =
    T extends { '$ref': infer R } ? InterfaceOf3<Select<X, R>, X> :
    T extends { allOf: infer R } ? 
        R extends Tuple<1> ? InterfaceOf3<R[0], X> :
        R extends Tuple<2> ? InterfaceOf3<R[0], X> & InterfaceOf3<R[1], X> :
        R extends Tuple<3> ? InterfaceOf3<R[0], X> & InterfaceOf3<R[1], X> & InterfaceOf3<R[2], X> :
        R extends Tuple<4> ? InterfaceOf3<R[0], X> & InterfaceOf3<R[1], X> & InterfaceOf3<R[2], X> & InterfaceOf3<R[3], X> :
        R extends Tuple<5> ? InterfaceOf3<R[0], X> & InterfaceOf3<R[1], X> & InterfaceOf3<R[2], X> & InterfaceOf3<R[3], X> & InterfaceOf3<R[4], X>:
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? InterfaceOf3<R, X> :
    T extends { not: infer R } ? Exclude<JsonObject, InterfaceOf3<R, X>> :
    ValueOf<T, X>;
type InterfaceOf3<T, X> =
    T extends { '$ref': infer R } ? ValueOf<Select<X, R>, X> :
    T extends { allOf: infer R } ?
        R extends Tuple<1> ? ValueOf<R[0], X> :
        R extends Tuple<2> ? ValueOf<R[0], X> & ValueOf<R[1], X> :
        R extends Tuple<3> ? ValueOf<R[0], X> & ValueOf<R[1], X> & ValueOf<R[2], X> :
        R extends Tuple<4> ? ValueOf<R[0], X> & ValueOf<R[1], X> & ValueOf<R[2], X> & ValueOf<R[3], X> :
        R extends Tuple<5> ? ValueOf<R[0], X> & ValueOf<R[1], X> & ValueOf<R[2], X> & ValueOf<R[3], X> & ValueOf<R[4], X>:
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? ValueOf<R, X> :
    T extends { not: infer R } ? Exclude<JsonObject, ValueOf<R, X>> :
    ValueOf<T, X>;
type ValueOf<T, X> =
    T extends { const: infer C } ? C :
    T extends { enum: readonly (infer R)[] } ? R :
    T extends { type: 'null' } ? null :
    T extends { type: 'boolean' } ? boolean :
    T extends { type: 'integer' } ? number :
    T extends { type: 'number' } ? number :
    T extends { type: 'string' } ? string :
    T extends { type: 'object' } ?
        T extends { properties: infer P; required: readonly (infer R)[] } ? {
            [K in keyof P & R]: InterfaceOf<P[K], X>;
        } & {
            [K in Exclude<keyof P, R>]?: InterfaceOf<P[K], X>;
        } :
        T extends { properties: infer P } ? {
            [K in keyof P]?: InterfaceOf<P[K], X>;
        } :
        T extends { additionalProperties: infer P } ? {
            [K in string]?: InterfaceOf<P, X>;
        } :
        JsonObject :
    T extends { type: 'array' } ?
        T extends { items: any[] } ? {
            [K in keyof T['items']]: InterfaceOf<T['items'][K], X>;
        } :
        T extends { items: infer I } ? ArrayOf<I, X> :
        JsonArray :
    JsonValue;
interface ArrayOf<T, X> extends Array<InterfaceOf<T, X>> {}

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
        },
    },
    type: 'object',
    properties: {
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
        }
    },
    required: ['id', 'name', 'other'],
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
    }
}
