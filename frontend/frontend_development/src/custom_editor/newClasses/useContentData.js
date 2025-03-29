// hooks/useContentData.js
import { useState, useEffect } from 'react';

/**
 * Universal content data parser with array support
 * @param {object|string} rawData - Input data (stringified or object)
 * @param {object} config - { defaultData, innerStyleDefaults }
 */
export const useContentData = (rawData, config) => {
  const { defaultData, innerStyleDefaults } = config;

  // Detect all array fields in defaultData
  const arrayFields = Object.entries(defaultData)
    .filter(([_, value]) => Array.isArray(value))
    .map(([key]) => key);

  const parseData = (data) => {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data || {};
    const result = { ...defaultData, ...parsed };

    // Process all detected array fields
    arrayFields.forEach((field) => {
      if (parsed[field]) {
        result[field] = Array.isArray(parsed[field])
          ? parsed[field].map((item) => ({
              ...(defaultData[field][0] || {}), // Clone defaults from first array item
              ...item,                          // Override with parsed data
            }))
          : [...defaultData[field]]; // Fallback to default array
      }
    });

    // Merge innerStyle
    result.innerStyle = {
      ...innerStyleDefaults,
      ...(parsed.innerStyle || {}),
    };

    return result;
  };

  // Initialize state
  const [contentData, setContentData] = useState(() => {
    try {
      return parseData(rawData);
    } catch (e) {
      console.error("Initial parse error:", e);
      return {
        ...defaultData,
        innerStyle: innerStyleDefaults,
      };
    }
  });

  // Update on rawData changes
  useEffect(() => {
    try {
      setContentData(parseData(rawData));
    } catch (error) {
      console.error("Update parse error:", error);
    }
  }, [rawData]);

  return [contentData, setContentData];
};