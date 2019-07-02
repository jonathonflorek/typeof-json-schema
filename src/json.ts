export interface JsonArray extends Array<JsonValue> {}
export type JsonObject = { [K in string]?: JsonValue };
export type JsonValue = JsonObject | JsonArray | JsonPrimitive;
export type JsonPrimitive = string | number | boolean | null;
