function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function checkDataForInitialization(incomingData) {
  const dataForInitialization = { ...incomingData };

  dataForInitialization.minimum = (dataForInitialization.minimum === undefined) ? 1 : dataForInitialization.minimum;
  dataForInitialization.maximum = (dataForInitialization.maximum === undefined) ? 10 : dataForInitialization.maximum;
  dataForInitialization.value = (dataForInitialization.value === undefined) ? dataForInitialization.minimum : dataForInitialization.value;
  dataForInitialization.valueRange = (dataForInitialization.valueRange === undefined) ? dataForInitialization.maximum : dataForInitialization.valueRange;
  dataForInitialization.step = (dataForInitialization.step === undefined) ? 1 : dataForInitialization.step;

  checkDataForUpdate(dataForInitialization);
  return dataForInitialization;
}

function checkDataForUpdate(incomingData) {
  const dataForUpdate = { ...incomingData };

  dataForUpdate.minimum = isNumeric(dataForUpdate.minimum) ? dataForUpdate.minimum : 1;
  dataForUpdate.maximum = isNumeric(dataForUpdate.maximum) ? dataForUpdate.maximum : 10;
  dataForUpdate.value = isNumeric(dataForUpdate.value) ? dataForUpdate.value : dataForUpdate.minimum;
  dataForUpdate.valueRange = isNumeric(dataForUpdate.valueRange) ? dataForUpdate.valueRange : dataForUpdate.maximum;
  dataForUpdate.step = isNumeric(dataForUpdate.step) ? dataForUpdate.step : 1;

  if (dataForUpdate.minimum >= dataForUpdate.maximum) {
    dataForUpdate.minimum = 1;
    dataForUpdate.maximum = 10;
    console.log('Некорректные значения minimum, maximum \nОбязательное условие: minimum < maximum \nИзменено на minimum = 1, maximum = 10.');
  }
  const isValueOfStepWithinAllowedInterval = (dataForUpdate.step < 1 || dataForUpdate.step > (dataForUpdate.maximum - dataForUpdate.minimum));
  if (isValueOfStepWithinAllowedInterval) {
    dataForUpdate.step = 1;
    console.log('Некорректное значение step \nОбязательное условие: \nstep >=1 && step <= (maximum - minimum) \nИзменено на step = 1.');
  }
  const isValuesWithinAllowedInterval = dataForUpdate.value > dataForUpdate.maximum || dataForUpdate.value < dataForUpdate.minimum;
  if (isValuesWithinAllowedInterval) {
    dataForUpdate.value = dataForUpdate.minimum;
    dataForUpdate.valueRange = dataForUpdate.maximum;
    console.log('Некорректные значения value \nОбязательное условие: \nminimum <= value <= maximum \nИзменено на value = minimum, valueRange = maximum.');
  }
  if (dataForUpdate.rangeStatus) {
    const isValueOfSecondElementIsLargerThanMaximum = dataForUpdate.valueRange > dataForUpdate.maximum;
    if (isValueOfSecondElementIsLargerThanMaximum) {
      dataForUpdate.value = dataForUpdate.minimum;
      dataForUpdate.valueRange = dataForUpdate.maximum;
      console.log('Некорректные значения valueRange \nОбязательное условие: \nvalueRange <= maximum \nИзменено на value = minimum, valueRange = maximum.');
    }
    if (dataForUpdate.value >= dataForUpdate.valueRange) {
      dataForUpdate.valueRange = dataForUpdate.value;
      dataForUpdate.value -= dataForUpdate.step;
      console.log('Некорректные значения value, valueRange \nОбязательное условие: \nvalue < valueRange \nИзменено на value = value - step, valueRange = value.');
    }
  }
  return dataForUpdate;
}

export { checkDataForInitialization, checkDataForUpdate };
