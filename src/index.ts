import { JsonArray, JsonObject, JsonValue } from './json';

export type GetValue<T, Ext extends {} = {}> = TypeOf<T, { '#': T } & Ext>;
export type GetDefinitions<T extends {definitions: any}, Ext extends {} = {}> = {
    [K in keyof T['definitions']]: TypeOf<T['definitions'][K], { '#': T } & Ext>;
};

export type TypeOf<T, X> =
    T extends { $ref: infer R } ? ValueOf2<Select<X, R>, X> :
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
    T extends { $ref: infer R } ? ValueOf1<Select<X, R>, X> :
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
    T extends { $ref: infer R } ? ValueOf<Select<X, R>, X> :
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
