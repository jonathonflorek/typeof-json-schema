// modified from https://github.com/krzkaczor/ts-essentials

export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends (any[] | ReadonlyArray<any>)
  ? DeepReadonlyArray<T[number]>
  : T extends Function
  ? T
  : T extends {}
  ? DeepReadonlyObject<T>
  : unknown;
type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type Primitive = string | number | boolean | bigint | symbol | undefined | null;
