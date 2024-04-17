import _ from "lodash";

export function deepMerge(target: object, ...sources: object[]) {
  return _.mergeWith(target, ...sources, (objValue: any, srcValue: any) => {
    if (_.isArray(objValue)) return objValue.concat(srcValue);
  });
}

export function parseDate(date: Date) {
  const year = date.getFullYear().toString();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
