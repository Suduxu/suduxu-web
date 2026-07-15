import { ConfigSchema } from '../lib/schema';
import React, { useEffect } from 'react';
import { ZodObject, ZodType, ZodDefault, ZodEnum, ZodArray } from 'zod';

// Utility to recursively extract schema details
const extractSchemaDetails = (
  schemaShape,
  category = 'Root',
  path = []
) => {
  const result = [];

  for (const key in schemaShape) {
    if (schemaShape.hasOwnProperty(key)) {
      let zodType = schemaShape[key];
      let defaultValue = undefined;
      let typeName = '';
      let options = undefined;
      let currentPath = [...path, key];

      // 1. Handle ZodDefault (to get the default value)
      if (zodType instanceof ZodDefault) {
        defaultValue = zodType._def.defaultValue();
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
        options = zodType._def.values;
      } else if (zodType instanceof ZodArray) {
        typeName = 'array';
        // You could also extract the type of the array items here:
        // const arrayItemType = zodType._def.type._def.typeName;
        // typeName = `array<${arrayItemType}>`;
      } else {
        // Standard Zod Types (string, number, boolean)
        typeName = zodType._def.typeName.replace('Zod', '').toLowerCase();
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