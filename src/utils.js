function equalArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  const sortedArr1 = JSON.stringify(arr1.sort());
  const sortedArr2 = JSON.stringify(arr2.sort());

  return sortedArr1 === sortedArr2;
}

export { equalArrays };
