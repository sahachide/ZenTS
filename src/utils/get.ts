/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

// Source: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
export function get<T = any>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue: T = undefined,
): T {
  const travel = (regexp: RegExp): T => {
    return String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res: Record<string, unknown>, key: string) =>
          res !== null && res !== undefined ? res[key] : res,
        obj,
      ) as T
  }

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)

  return result === undefined || result === obj ? defaultValue : result
}
