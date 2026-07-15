import { ConfigSchema } from '../lib/schema';
import { useEffect } from 'react';
import { ZodObject, ZodDefault, ZodEnum, ZodArray } from 'zod';

type SchemaDetail = {
  key: string;
  category: string;
  path: string;
  type: string;
  defaultValue: unknown;
  options?: unknown[];
  details?: SchemaDetail[];
};

// Utility to recursively extract schema details
const extractSchemaDetails = (
  schemaShape: Record<string, unknown>,
  category = 'Root',
  path: string[] = []
): SchemaDetail[] => {
  const result: SchemaDetail[] = [];

  for (const key in schemaShape) {
    if (schemaShape.hasOwnProperty(key)) {
      let zodType = schemaShape[key];
      let defaultValue = undefined;
      let typeName = '';
      let options = undefined;
      let currentPath = [...path, key];

      // 1. Handle ZodDefault (to get the default value)
      if (zodType instanceof ZodDefault) {
        // _def.defaultValue can be a function that returns the default or a value; its type is unknown
        const maybeDefault = (zodType._def as any).defaultValue;
        try {
          defaultValue = typeof maybeDefault === 'function' ? maybeDefault() : maybeDefault;
        } catch (e) {
          defaultValue = undefined;
        }
        zodType = zodType._def.innerType; // Get the inner type
      }

      // 2. Extract Type and Options
      if (zodType instanceof ZodObject) {
        // Handle nested object recursively
        typeName = 'object';
        const nestedResult = extractSchemaDetails(
          zodType.shape,
          key,
          currentPath
        );
        result.push({
          key,
          category,
          path: currentPath.join('.'),
          type: typeName,
          defaultValue: JSON.stringify(defaultValue), // Default for an object is its whole structure
          details: nestedResult, // Store the nested fields here
        });
        continue; // Skip further processing for this object
      } else if (zodType instanceof ZodEnum) {
        typeName = 'enum';
        options = Array.isArray((zodType._def as any).values)
          ? (zodType._def as any).values
          : Object.values((zodType._def as any).entries ?? {});
      } else if (zodType instanceof ZodArray) {
        typeName = 'array';
      } else {
        typeName = ((zodType as any)._def?.typeName ?? '').replace('Zod', '').toLowerCase();
      }
      
      // 3. Push the field details
      result.push({
        key,
        category,
        path: currentPath.join('.'),
        type: typeName,
        defaultValue: defaultValue !== undefined ? defaultValue : null,
        options,
      });
    }
  }

  return result;
};

// ---

const ConfigRendererComponent = () => {
  useEffect(() => {
    console.log('--- Config Schema Details ---');
    const schemaDetails = extractSchemaDetails(ConfigSchema.shape);
    console.log(schemaDetails);
    console.log('-----------------------------');

    // You can also set this to a state variable here for rendering:
    // setSchemaData(schemaDetails);
  }, []);

  // ... rest of your component logic and rendering
  return <div>Check the console for the structured schema data!</div>;
};

export default ConfigRendererComponent;