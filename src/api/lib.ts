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
 * @param string 
 */
export function escapeRegExp(string: string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



let index = 1;


console.log("FIRST", index++);

for (let i = 0; i < 100; ++i) {
  (new Promise((resolve, reject) => {
    resolve();
  })).then(() => {
    console.log(index++);
  });
}



console.log("LAST", index++);

