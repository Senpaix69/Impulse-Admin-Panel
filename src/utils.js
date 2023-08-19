function equalArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  const sortedArr1 = JSON.stringify(arr1.sort());
  const sortedArr2 = JSON.stringify(arr2.sort());

  return sortedArr1 === sortedArr2;
}

function matchColors(hexColors, intColors) {
  if (hexColors.length !== intColors.length) {
    return false;
  }
  const hexConverted = intColors.map((color) => intToHex(color));
  return equalArrays(hexColors, hexConverted);
}

const hexToInt = (hexColor) => {
  const colorRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
  const result = colorRegex.exec(hexColor);
  if (!result) return null;

  const [, r, g, b, a = "FF"] = result;

  return `0x${a}${r}${g}${b}`;
};

function intToHex(color) {
  const hexColor = color.toString(16).substring(4);
  return `#${hexColor}`;
}

export { equalArrays, hexToInt, intToHex, matchColors };
