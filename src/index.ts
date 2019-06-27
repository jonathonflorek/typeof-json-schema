import { JsonArray, JsonObject, JsonPrimitive, JsonValue } from './json';

export type ToInterface<T> = InterfaceOf<T, { '#': T; [key: string]: unknown }>;
type InterfaceOf<T, X> = 
    T extends { anyOf: readonly (infer R)[] } ? ValueOf<R, X> :
    ValueOf<T, X>;
type ValueOf<T, X> =
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
        T extends { items: infer I } ? ArrayOf<T, X> :
        JsonArray :
    JsonValue;
interface ArrayOf<T, X> extends Array<InterfaceOf<T, X>> {}

const thing = {
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
        }
    },
    required: ['id', 'name', 'other']
} as const;
const other = {
    type: 'string',
} as const;
type Thing = ToInterface<typeof thing | typeof other>;
