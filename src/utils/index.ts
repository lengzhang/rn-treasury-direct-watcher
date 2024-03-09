import _ from "lodash";

export function deepMerge(target: object, ...sources: object[]) {
  return _.mergeWith(target, ...sources, (objValue: any, srcValue: any) => {
    if (_.isArray(objValue)) return objValue.concat(srcValue);
  });
}
