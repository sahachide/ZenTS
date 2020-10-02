/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Source: https://stackoverflow.com/questions/54733539/javascript-implementation-of-lodash-set-method
export function set(
  obj: Record<string, unknown>,
  path: string,
  value: any,
): Record<string, unknown> {
  if (Object(obj) !== obj) {
    return obj
  } // When obj is not an object
  // If not yet an array, get the keys from the string-path
  if (!Array.isArray(path)) {
    // @ts-ignore
    path = path.toString().match(/[^.[\]]+/g) || []
  }

  // @ts-ignore
  path.slice(0, -1).reduce(
    (
      // @ts-ignore
      a,
      // @ts-ignore
      c,
      // @ts-ignore
      i, // Iterate all of them except the last one
    ) =>
      Object(a[c]) === a[c] // Does the key exist and is its value an object?
        ? // Yes: then follow that path
          a[c]
        : // No: create the key. Is the next key a potential array-index?
          (a[c] =
            // @ts-ignore
            Math.abs(path[i + 1]) >> 0 === +path[i + 1]
              ? [] // Yes: assign a new array object
              : {}), // No: assign a new plain object
    obj,
  )[path[path.length - 1]] = value // Finally assign the value to the last key

  return obj // Return the top-level object to allow chaining
}
