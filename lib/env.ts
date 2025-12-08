/**
 * Environment detection utilities
 */

/**
 * Check if running in development mode
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Check if running in production mode
 */
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Get the current environment
 */
export const getEnvironment = (): 'development' | 'production' | 'test' => {
  return (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development';
};

/**
 * Check if running in test mode
 */
export const isTest = () => {
  return process.env.NODE_ENV === 'test';
};

