// Pure JSON-schema validation helpers copied from the immutable v0.9.4-mp1 validator.
// No package initialization, fixtures, signing or release mutation is executed.
const isObject = value => value !== null && typeof value === "object" && !Array.isArray(value);
const canonicalJson = value => Array.isArray(value) ? `[${value.map(canonicalJson).join(",")}]` : isObject(value) ? `{${Object.keys(value).sort().map(key => JSON.stringify(key) + ":" + canonicalJson(value[key])).join(",")}}` : JSON.stringify(value);
const sameValue = (a, b) => canonicalJson(a) === canonicalJson(b);
const unique = values => Array.isArray(values) && new Set(values.map(canonicalJson)).size === values.length;
function pointer(root, ref) {
  if (!ref.startsWith("#/")) throw new Error(`only local JSON Pointer refs are supported (${ref})`);
  let value = root;
  for (const raw of ref.slice(2).split("/")) {
    const key = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    if (!isObject(value) && !Array.isArray(value)) throw new Error(`unresolvable ref ${ref}`);
    value = value[key];
  }
  if (value === undefined) throw new Error(`unresolvable ref ${ref}`);
  return value;
}

function resolveJsonPointerFragment(document, fragment) {
  if (fragment === undefined || fragment === "") return document;
  if (!fragment.startsWith("/")) return null;
  try {
    return pointer(document, `#${fragment}`);
  } catch {
    return null;
  }
}

function typeMatches(value, type) {
  if (type === "null") return value === null;
  if (type === "array") return Array.isArray(value);
  if (type === "object") return isObject(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  return typeof value === type;
}

function validateSchema(schema, value, root = schema, instancePath = "$", schemaPath = "#") {
  const errors = [];
  const add = (message) => errors.push(`${instancePath}: ${message} (${schemaPath})`);

  if (schema === true) return errors;
  if (schema === false) {
    add("boolean schema rejects the value");
    return errors;
  }
  if (!isObject(schema)) {
    add("schema node is not an object or boolean");
    return errors;
  }

  if (schema.$ref) {
    try {
      errors.push(...validateSchema(pointer(root, schema.$ref), value, root, instancePath, schema.$ref));
    } catch (error) {
      add(error.message);
    }
  }

  if (Array.isArray(schema.allOf)) {
    schema.allOf.forEach((part, index) => errors.push(...validateSchema(part, value, root, instancePath, `${schemaPath}/allOf/${index}`)));
  }
  if (Array.isArray(schema.anyOf)) {
    const branches = schema.anyOf.map((part, index) => validateSchema(part, value, root, instancePath, `${schemaPath}/anyOf/${index}`));
    if (!branches.some((branch) => branch.length === 0)) add("does not satisfy anyOf");
  }
  if (Array.isArray(schema.oneOf)) {
    const passing = schema.oneOf.filter((part, index) => validateSchema(part, value, root, instancePath, `${schemaPath}/oneOf/${index}`).length === 0).length;
    if (passing !== 1) add(`must satisfy exactly one oneOf branch; satisfied ${passing}`);
  }
  if (schema.not && validateSchema(schema.not, value, root, instancePath, `${schemaPath}/not`).length === 0) add("matches prohibited not schema");
  if (schema.if) {
    const matches = validateSchema(schema.if, value, root, instancePath, `${schemaPath}/if`).length === 0;
    if (matches && schema.then) errors.push(...validateSchema(schema.then, value, root, instancePath, `${schemaPath}/then`));
    if (!matches && schema.else) errors.push(...validateSchema(schema.else, value, root, instancePath, `${schemaPath}/else`));
  }

  if (Object.hasOwn(schema, "const") && !sameValue(value, schema.const)) add(`must equal const ${JSON.stringify(schema.const)}`);
  if (Array.isArray(schema.enum) && !schema.enum.some((entry) => sameValue(value, entry))) add("is not in enum");

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => typeMatches(value, type))) {
      add(`must be ${types.join(" or ")}`);
      return errors;
    }
  }

  if (isObject(value)) {
    if (Number.isInteger(schema.minProperties) && Object.keys(value).length < schema.minProperties) add(`must have at least ${schema.minProperties} properties`);
    if (Number.isInteger(schema.maxProperties) && Object.keys(value).length > schema.maxProperties) add(`must have at most ${schema.maxProperties} properties`);
    for (const required of schema.required ?? []) {
      if (!Object.hasOwn(value, required)) errors.push(`${instancePath}: missing required property ${required} (${schemaPath}/required)`);
    }
    const properties = schema.properties ?? {};
    for (const [key, childSchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, key)) errors.push(...validateSchema(childSchema, value[key], root, `${instancePath}/${key}`, `${schemaPath}/properties/${key}`));
    }
    const patternProperties = schema.patternProperties ?? {};
    const compiledPatterns = [];
    for (const [pattern, childSchema] of Object.entries(patternProperties)) {
      try {
        compiledPatterns.push([new RegExp(pattern, "u"), childSchema, pattern]);
      } catch (error) {
        errors.push(`${instancePath}: invalid schema pattern ${pattern}: ${error.message}`);
      }
    }
    for (const [key, child] of Object.entries(value)) {
      const matchingPatterns = compiledPatterns.filter(([regex]) => regex.test(key));
      matchingPatterns.forEach(([, childSchema, pattern]) => errors.push(...validateSchema(childSchema, child, root, `${instancePath}/${key}`, `${schemaPath}/patternProperties/${pattern}`)));
      const declared = Object.hasOwn(properties, key) || matchingPatterns.length > 0;
      if (!declared && schema.additionalProperties === false) errors.push(`${instancePath}/${key}: undeclared property (${schemaPath}/additionalProperties)`);
      if (!declared && isObject(schema.additionalProperties)) errors.push(...validateSchema(schema.additionalProperties, child, root, `${instancePath}/${key}`, `${schemaPath}/additionalProperties`));
    }
  }

  if (Array.isArray(value)) {
    if (Number.isInteger(schema.minItems) && value.length < schema.minItems) add(`must contain at least ${schema.minItems} items`);
    if (Number.isInteger(schema.maxItems) && value.length > schema.maxItems) add(`must contain at most ${schema.maxItems} items`);
    if (schema.uniqueItems === true && !unique(value)) add("items must be unique");
    if (schema.items) value.forEach((item, index) => errors.push(...validateSchema(schema.items, item, root, `${instancePath}/${index}`, `${schemaPath}/items`)));
    if (schema.contains) {
      const matches = value.filter((item, index) => validateSchema(schema.contains, item, root, `${instancePath}/${index}`, `${schemaPath}/contains`).length === 0).length;
      const minimum = schema.minContains ?? 1;
      const maximum = schema.maxContains ?? Number.POSITIVE_INFINITY;
      if (matches < minimum || matches > maximum) add(`contains match count ${matches} is outside ${minimum}..${maximum}`);
    }
  }

  if (typeof value === "string") {
    const length = [...value].length;
    if (Number.isInteger(schema.minLength) && length < schema.minLength) add(`must have length at least ${schema.minLength}`);
    if (Number.isInteger(schema.maxLength) && length > schema.maxLength) add(`must have length at most ${schema.maxLength}`);
    if (schema.pattern) {
      try {
        if (!new RegExp(schema.pattern, "u").test(value)) add(`does not match pattern ${schema.pattern}`);
      } catch (error) {
        add(`invalid schema pattern ${schema.pattern}: ${error.message}`);
      }
    }
    if (schema.format === "date-time") {
      const looksLikeDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value);
      if (!looksLikeDateTime || Number.isNaN(Date.parse(value))) add("must be an RFC 3339 date-time");
    }
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    if (typeof schema.minimum === "number" && value < schema.minimum) add(`must be >= ${schema.minimum}`);
    if (typeof schema.maximum === "number" && value > schema.maximum) add(`must be <= ${schema.maximum}`);
  }
  return errors;
}

export { validateSchema };
