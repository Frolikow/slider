/* eslint-disable prefer-destructuring */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const defaultInitialData = {
  minimum: 1,
  maximum: 10,
  step: 1,
  firstValue: 1,
  secondValue: 10,
};

function validateInitialData(incomingData) {
  const dataForInitialization = { ...defaultInitialData, ...incomingData };

  const verifiedData = validateIncomingData(dataForInitialization);
  return verifiedData;
}

function validateIncomingData(incomingData) {
  // eslint-disable-next-line prefer-const
  let { minimum, maximum, firstValue, secondValue, step, hasIntervalSelection } = incomingData;

  if (!isNumeric(minimum)) {
    minimum = defaultInitialData.minimum;
  }
  if (!isNumeric(maximum)) {
    maximum = defaultInitialData.maximum;
  }
  if (!isNumeric(firstValue)) {
    firstValue = defaultInitialData.firstValue;
  }
  if (!isNumeric(secondValue)) {
    secondValue = defaultInitialData.secondValue;
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

  const isValueWithinAllowedInterval = firstValue > maximum || firstValue < minimum;
  if (isValueWithinAllowedInterval) {
    firstValue = minimum;
    secondValue = maximum;
    console.log('Некорректные значения firstValue \nОбязательное условие: \nminimum <= firstValue <= maximum \nИзменено на firstValue = minimum, secondValue = maximum.');
  }

  if (hasIntervalSelection) {
    const isSecondElementValueIsLargerThanMaximum = secondValue > maximum;
    if (isSecondElementValueIsLargerThanMaximum) {
      firstValue = minimum;
      secondValue = maximum;
      console.log('Некорректные значения secondValue \nОбязательное условие: \nvalueRange <= maximum \nИзменено на firstValue = minimum, secondValue = maximum.');
    }
    if (firstValue >= secondValue) {
      secondValue = firstValue;
      firstValue = minimum;
      console.log('Некорректные значения firstValue, secondValue \nОбязательное условие: \nvalue < secondValue \nИзменено на firstValue = firstValue - step, secondValue = firstValue.');
    }
  }

  const dataForUpdate = { ...incomingData, minimum, maximum, firstValue, secondValue, step, hasIntervalSelection };
  return dataForUpdate;
}

export { validateInitialData, validateIncomingData };
