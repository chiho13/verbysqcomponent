export const capitalize = (str) =>
  str && str.charAt(0).toUpperCase() + str.slice(1);

export const getUniqueValues = (arr, key) => {
  const uniqueValues = Array.from(new Set(arr.map((item) => item[key])));
  return uniqueValues.map((value) => {
    return {
      key: key,
      value: value.charAt(0).toUpperCase() + value.slice(1),
    };
  });
};
