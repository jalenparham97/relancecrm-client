export function omitObjProperty<T>(originalObject: T, keysToOmit: string[] = []): T {
  const clonedObject = { ...originalObject };

  for (const path of keysToOmit) {
    delete clonedObject[path];
  }

  return clonedObject;
}
