/* eslint-disable prefer-destructuring */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const defaultInitialData = {
  minimum: 1,
  maximum: 10,
  step: 1,
};
defaultInitialData.value = defaultInitialData.minimum;
defaultInitialData.valueRange = defaultInitialData.maximum;

function validateInitialData(incomingData) {
  const dataForInitialization = { ...defaultInitialData, ...incomingData };

  const verifiedData = validateIncomingData(dataForInitialization);
  return verifiedData;
}

function validateIncomingData(incomingData) {
  // eslint-disable-next-line prefer-const
  let { minimum, maximum, value, valueRange, step, isIntervalSelection } = incomingData;

  if (!isNumeric(minimum)) {
    minimum = defaultInitialData.minimum;
  }
  if (!isNumeric(maximum)) {
    maximum = defaultInitialData.maximum;
  }
  if (!isNumeric(value)) {
    value = defaultInitialData.value;
  }
  if (!isNumeric(valueRange)) {
    valueRange = defaultInitialData.valueRange;
  }
  if (!isNumeric(step)) {
    step = defaultInitialData.step;
  }

  if (minimum >= maximum) {
    minimum = 1;
    maximum = 10;
    console.log('Некорректные значения minimum, maximum \nОбязательное условие: minimum < maximum \nИзменено на minimum = 1, maximum = 10.');
  }

  const isStepValueWithinAllowedInterval = (step < 1 || step > (maximum - minimum));
  if (isStepValueWithinAllowedInterval) {
    step = 1;
    console.log('Некорректное значение step \nОбязательное условие: \nstep >=1 && step <= (maximum - minimum) \nИзменено на step = 1.');
  }

  const isValueWithinAllowedInterval = value > maximum || value < minimum;
  if (isValueWithinAllowedInterval) {
    value = minimum;
    valueRange = maximum;
    console.log('Некорректные значения value \nОбязательное условие: \nminimum <= value <= maximum \nИзменено на value = minimum, valueRange = maximum.');
  }

  if (isIntervalSelection) {
    const isSecondElementValueIsLargerThanMaximum = valueRange > maximum;
    if (isSecondElementValueIsLargerThanMaximum) {
      value = minimum;
      valueRange = maximum;
      console.log('Некорректные значения valueRange \nОбязательное условие: \nvalueRange <= maximum \nИзменено на value = minimum, valueRange = maximum.');
    }
    if (value >= valueRange) {
      valueRange = value;
      value -= step;
      console.log('Некорректные значения value, valueRange \nОбязательное условие: \nvalue < valueRange \nИзменено на value = value - step, valueRange = value.');
    }
  }

  const dataForUpdate = { ...incomingData, minimum, maximum, value, valueRange, step, isIntervalSelection };
  return dataForUpdate;
}

export { validateInitialData, validateIncomingData };
