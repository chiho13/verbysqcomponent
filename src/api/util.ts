export const capitalize = (str: string): string =>
  str && str.charAt(0).toUpperCase() + str.slice(1);

interface UniqueValue {
  key: string;
  value: string;
}

export const getUniqueValues = (
  arr: { [key: string]: any }[],
  key: string
): UniqueValue[] => {
  const uniqueValues = Array.from(new Set(arr.map((item) => item[key])));
  return uniqueValues.map((value) => {
    return {
      key,
      value,
    };
  });
};
