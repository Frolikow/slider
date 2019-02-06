
function createRange(minimum, maximum, step) {
  let currentValue = minimum;
  const possibleSliderValues = [];

  while (currentValue <= maximum) {
    possibleSliderValues.push(currentValue);
    currentValue += step;
  }
  return possibleSliderValues;
}

export default createRange;
