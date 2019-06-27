export interface JsonArray extends Array<JsonValue> {}
export type JsonObject = { [K in string]?: JsonValue };
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonObject | JsonArray | JsonPrimitive;
