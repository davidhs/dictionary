/**
 * Asserts condition `condition`.
 * 
 * @param condition 
 * @param message 
 */
export function assert(condition: any, message = "Assertion failed"): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * A function to escape characters in a string so they won't be treated as
 * meta-characters in the construction of a regular expresion.
 * 
 * @param str
 */
export function escapeRegExp(str: string) {
  // $& means the whole matched string
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
