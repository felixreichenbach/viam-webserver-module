export const comparePartIds = (current: string[], last: string[]) => {
  const currentSet = new Set(current);
  const lastSet = new Set(last);

  const added = current.filter((item) => !lastSet.has(item));
  const removed = last.filter((item) => !currentSet.has(item));
  const unchanged = current.filter((item) => lastSet.has(item));

  return { added, removed, unchanged };
};

export const isJsonEqual = (object1: object, object2: object) => {
  if (!isObject(object1) || !isObject(object2)) {
    return object1 === object2;
  }

  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) {
    return false;
  }

  for (const key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if (
      (isObjects && !isJsonEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false;
    }
  }

  return true;
};

const isObject = (object: unknown): object is Record<string, unknown> => {
  return object != null && typeof object === 'object';
};
