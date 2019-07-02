import { DeepReadonly } from './deepReadonly';
import { JsonValue } from './json';

const fix = (key: string, value: any) => key === '$ref' && Array.isArray(value) ? value.join('/') : value;
const fixRec = (value: DeepReadonly<JsonValue>): JsonValue => JSON.parse(JSON.stringify(value, fix));
