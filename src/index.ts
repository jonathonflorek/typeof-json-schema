import { JsonArray, JsonObject, JsonValue } from './json';

export type GetValue<T, Ext extends {} = {}> = TypeOf<T, { '#': T } & Ext>;
export type GetDefinitions<T extends {definitions: any}, Ext extends {} = {}> = {
    [K in keyof T['definitions']]: TypeOf<T['definitions'][K], { '#': T } & Ext>;
};

export type TypeOf<T, X> =
    T extends { $ref: infer R } ? 
        R extends '#' | readonly ['#', ...string[]] ? ValueOf2<Select<X, R>, X> :
        Select<X, R> :
    T extends { allOf: infer R } ? 
        R extends readonly any[] ? And<{[K in keyof R]: ValueOf2<R[K], X>}> :
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? ValueOf2<R & T, X> :
    ValueOf<T, X>;
type ValueOf2<T, X> =
    T extends { $ref: infer R } ?
        R extends '#' | readonly ['#', ...string[]] ? ValueOf1<Select<X, R>, X> :
        Select<X, R> :
    T extends { allOf: infer R } ?
        R extends readonly any[] ? And<{[K in keyof R]: ValueOf1<R[K], X>}> :
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? ValueOf1<R & T, X> :
    ValueOf<T, X>;
type ValueOf1<T, X> =
    T extends { $ref: infer R } ?
        R extends '#' | readonly ['#', ...string[]] ? ValueOf<Select<X, R>, X> :
        Select<X, R> :
    T extends { allOf: infer R } ?
        R extends readonly any[] ? And<{[K in keyof R]: ValueOf<R[K], X>}> :
        JsonValue :
    T extends { anyOf: readonly (infer R)[] } ? ValueOf<R & T, X> :
    ValueOf<T, X>;
type ValueOf<T, X> =
    T extends true ? JsonValue :
    T extends false ? never :
    T extends { const: infer C } ? C :
    T extends { enum: readonly (infer R)[] } ? R :
    T extends { type: infer R } ?
        ('object' extends ExtractType<R> ? 
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
        never) |
        ('array' extends ExtractType<R> ?
            T extends { items: infer R } ?
                R extends readonly any[] ? {
                    [K in Exclude<keyof R, keyof any[] & string>]: TypeOf<R[K], X>;
                } & (
                    T extends { additionalItems: false } ? readonly unknown[] & Pick<R, 'length'> : JsonArray
                ) : (ArrayOf<R, X>) :
            JsonArray :
        never) |
        ('string' extends ExtractType<R> ? string : never) |
        ('number' extends ExtractType<R> ? number : never) |
        ('integer' extends ExtractType<R> ? number : never) |
        ('boolean' extends ExtractType<R> ? boolean : never) |
        ('null' extends ExtractType<R> ? null : never) :
    JsonValue;
type ExtractType<T> = T extends readonly (infer I)[] ? I : T;
interface ArrayOf<T, X> extends Array<TypeOf<T, X>> {}

type Head<T extends readonly any[]> = T extends [infer U, ...any[]] ? U : never;
type Tail<T extends readonly any[]> = ((...args: T) => void) extends (head: any, ...tail: infer U) => any ? U : never;
type Select<T, K> =
    K extends keyof T ? T[K] :
    K extends readonly string[] ? SelectRecursive<T, K> :
    never;
type SelectRecursive<T, K extends readonly string[], KHead = Head<K>> = {
    0: T;
    1: KHead extends keyof T ? SelectRecursive<T[KHead], Tail<K>> : never;
}[K extends readonly [any, ...any[]] ? 1 : 0];
type And<T extends readonly any[]> = {
    0: JsonValue;
    1: Head<T> & And<Tail<T>>;
}[T extends readonly [any, ...any[]] ? 1 : 0];

/*
type TypeOf<T, X> = {
    0: T extends { $ref: infer R } ?
        R extends '#' | readonly ['#', ...string[]] ? TypeOf<Select<X, R>, X> :
        Select<X, R> :
    never;
    1: T extends { allOf: infer R } ?
        R extends readonly any[] ? And<{[K in keyof R]: TypeOf<R[K], X>}> :
        JsonValue :
    never;
    2: T extends { anyOf: readonly (infer R)[] } ? TypeOf<R & Exclude<T, 'anyOf'>, X> : never;
    3: 
        T extends true ? JsonValue :
        T extends false ? never :
        ...
}[
    T extends { $ref: any } ? 0 : 
    T extends { allOf: any } ? 1 : 
    T extends { anyOf: readonly any[] } ? 2 : 
    3
];
*/
