
function createRange(minimum, maximum, step) {
  let currentValue = minimum;
  const arrayOfPossibleHandleValues = [];

  while (currentValue <= maximum) {
    arrayOfPossibleHandleValues.push(currentValue);
    currentValue += step;
  }
  return arrayOfPossibleHandleValues;
}

export default createRange;
