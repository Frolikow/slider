import EventEmitter from '../eventEmiter/eventEmiter';

class Model extends EventEmitter {
  constructor(options) {
    super();
    super.addEmitter(this.constructor.name);

    this.modelData = {
      minimum: options.minimum,
      maximum: options.maximum,
      value: options.value,
      valueRange: options.valueRange,
      step: options.step,
      rangeStatus: options.rangeStatus,
      visibilityTooltips: options.visibilityTooltips,
      verticalOrientation: options.verticalOrientation,
    };
    this.relativeSliderWidth = 1000;

    this._checkIncomingData();
  }

  updateState(newDataToUpdateTheState) {
    this.modelData.minimum = (newDataToUpdateTheState.minimum === undefined) ? this.modelData.minimum : newDataToUpdateTheState.minimum;
    this.modelData.maximum = (newDataToUpdateTheState.maximum === undefined) ? this.modelData.maximum : newDataToUpdateTheState.maximum;
    this.modelData.value = (newDataToUpdateTheState.value === undefined) ? this.modelData.value : newDataToUpdateTheState.value;
    this.modelData.valueRange = (newDataToUpdateTheState.valueRange === undefined) ? this.modelData.valueRange : newDataToUpdateTheState.valueRange;
    this.modelData.step = (newDataToUpdateTheState.step === undefined) ? this.modelData.step : newDataToUpdateTheState.step;
    this.modelData.rangeStatus = (newDataToUpdateTheState.rangeStatus === undefined) ? this.modelData.rangeStatus : newDataToUpdateTheState.rangeStatus;
    this.modelData.visibilityTooltips = (newDataToUpdateTheState.visibilityTooltips === undefined) ? this.modelData.visibilityTooltips : newDataToUpdateTheState.visibilityTooltips;
    this.modelData.verticalOrientation = (newDataToUpdateTheState.verticalOrientation === undefined) ? this.modelData.verticalOrientation : newDataToUpdateTheState.verticalOrientation;
    this._checkIncomingData();
    this.sendNewDataFromModel();
  }
  sendNewDataFromModel() {
    const firstRelativePosition = this._calculateRelativePosition(this.modelData.value);
    const secondRelativePosition = this._calculateRelativePosition(this.modelData.valueRange);
    const firstValue = this._calculateValueForTheHandle(firstRelativePosition);
    const secondValue = this._calculateValueForTheHandle(secondRelativePosition);

    const newData = {
      value: firstValue,
      valueRange: secondValue,
      firstRelativePosition,
      secondRelativePosition,
      minimum: this.modelData.minimum,
      maximum: this.modelData.maximum,
      step: this.modelData.step,
      rangeStatus: this.modelData.rangeStatus,
      visibilityTooltips: this.modelData.visibilityTooltips,
      verticalOrientation: this.modelData.verticalOrientation,
    };
    this.notify('sendNewDataFromModel', newData);
  }

  updateValuesForStaticCoordinates(relativeCoordinates) {
    const calculatedValue = this._calculateValueForTheHandle(relativeCoordinates);
    this.firstRelativePosition = this._calculateRelativePosition(this.modelData.value);
    this.secondRelativePosition = this._calculateRelativePosition(this.modelData.valueRange);

    if (this.modelData.rangeStatus) {
      const newPositionCloserToTheSecondElement = (relativeCoordinates - this.firstRelativePosition) > (this.secondRelativePosition - relativeCoordinates);
      const newPositionCloserToTheFirstElement = (relativeCoordinates - this.firstRelativePosition) < (this.secondRelativePosition - relativeCoordinates);
      if (newPositionCloserToTheSecondElement) {
        this.modelData.valueRange = parseInt(calculatedValue);
      } else if (newPositionCloserToTheFirstElement) {
        this.modelData.value = parseInt(calculatedValue);
      }
    } else {
      this.modelData.value = parseInt(calculatedValue);
    }
    this.sendNewDataFromModel();
  }

  updateValuesForDynamicCoordinates(dataForSearchPosition) {
    const calculatedValue = this._calculateValueForTheHandle(dataForSearchPosition.relativeCoordinates);
    this.firstRelativePosition = this._calculateRelativePosition(this.modelData.value + this.modelData.step);
    this.secondRelativePosition = this._calculateRelativePosition(this.modelData.valueRange - this.modelData.step);

    if (this.modelData.rangeStatus) {
      if (dataForSearchPosition.elementType === 'first') {
        if (dataForSearchPosition.relativeCoordinates <= this.secondRelativePosition) {
          this.modelData.value = parseInt(calculatedValue);
        }
      } else if (dataForSearchPosition.elementType === 'second') {
        if (dataForSearchPosition.relativeCoordinates >= this.firstRelativePosition) {
          this.modelData.valueRange = parseInt(calculatedValue);
        }
      }
    } else {
      this.modelData.value = parseInt(calculatedValue);
    }
    this.sendNewDataFromModel();
  }
  _checkIncomingData() {
    this.modelData.minimum = (this.modelData.minimum === undefined) ? 1 : this.modelData.minimum;
    this.modelData.maximum = (this.modelData.maximum === undefined) ? 10 : this.modelData.maximum;
    this.modelData.value = (this.modelData.value === undefined) ? this.modelData.minimum : this.modelData.value;
    this.modelData.valueRange = (this.modelData.valueRange === undefined) ? this.modelData.maximum : this.modelData.valueRange;
    this.modelData.step = (this.modelData.step === undefined) ? 1 : this.modelData.step;

    if (this.modelData.minimum >= this.modelData.maximum) {
      this.modelData.minimum = 1;
      this.modelData.maximum = 10;
      console.log('Неккоректные значения minimum, maximum \nОбязательное условие: minimum < maximum \nИзменено на minimum = 1, maximum = 10.');
    }
    const isValueOfStepWithinTheAllowedInterval = (this.modelData.step < 1 || this.modelData.step > (this.modelData.maximum - this.modelData.minimum));
    if (isValueOfStepWithinTheAllowedInterval) {
      this.modelData.step = 1;
      console.log('Неккоректное значение step \nОбязательное условие: \nstep >=1 && step <= (maximum - minimum) \nИзменено на step = 1.');
    }
    const isValuesWithinTheAllowedInterval = this.modelData.value > this.modelData.maximum || this.modelData.value < this.modelData.minimum;
    if (isValuesWithinTheAllowedInterval) {
      this.modelData.value = this.modelData.minimum;
      this.modelData.valueRange = this.modelData.maximum;
      console.log('Неккоректные значения value \nОбязательное условие: \nminimum <= value <= maximum \nИзменено на value = minimum, valueRange = maximum.');
    }
    if (this.modelData.rangeStatus) {
      const isValueOfTheSecondElementIsLargerThanTheMaximum = this.modelData.valueRange > this.modelData.maximum;
      if (isValueOfTheSecondElementIsLargerThanTheMaximum) {
        this.modelData.value = this.modelData.minimum;
        this.modelData.valueRange = this.modelData.maximum;
        console.log('Неккоректные значения valueRange \nОбязательное условие: \nvalueRange <= maximum \nИзменено на value = minimum, valueRange = maximum.');
      }
      if (this.modelData.value >= this.modelData.valueRange) {
        this.modelData.valueRange = this.modelData.value;
        this.modelData.value -= this.modelData.step;
        console.log('Неккоректные значения value, valueRange \nОбязательное условие: \nvalue < valueRange \nИзменено на value = value - step, valueRange = value.');
      }
    }
  }
  _calculateRelativePosition(elementValueForPositionCalculation) {
    const arrayOfValuesForTheHandle = this._createAnArrayOfValidValues();

    this.relativeStepWidth = this.relativeSliderWidth / (arrayOfValuesForTheHandle.length - 1);
    let relativePosition = this.relativeStepWidth * (arrayOfValuesForTheHandle.indexOf(elementValueForPositionCalculation));

    if (relativePosition <= 0) {
      relativePosition = 0;
    } else if (relativePosition >= this.relativeSliderWidth) {
      relativePosition = this.relativeSliderWidth;
    }
    if (elementValueForPositionCalculation === this.modelData.value) {
      if (arrayOfValuesForTheHandle.includes(elementValueForPositionCalculation) === false) {
        relativePosition = 0;
      }
    } else if (elementValueForPositionCalculation === this.modelData.valueRange) {
      if (arrayOfValuesForTheHandle.includes(elementValueForPositionCalculation) === false) {
        relativePosition = this.relativeSliderWidth;
      }
    }
    return relativePosition;
  }
  _calculateValueForTheHandle(relativeCoordinates) {
    const arrayOfValuesForTheHandle = this._createAnArrayOfValidValues();
    if (relativeCoordinates <= 0) {
      relativeCoordinates = 0;
    } else if (relativeCoordinates >= this.relativeSliderWidth) {
      relativeCoordinates = this.relativeSliderWidth;
    }

    const indexOfValueRelativeToCoordinates = (((relativeCoordinates) + (this.relativeStepWidth / 2)) / this.relativeStepWidth) ^ 0;

    const isFirstElementPeaked = this.modelData.rangeStatus && (indexOfValueRelativeToCoordinates >= arrayOfValuesForTheHandle.indexOf(this.modelData.valueRange - this.modelData.step));
    let newValue;
    if (this.modelData.rangeStatus) {
      newValue = (arrayOfValuesForTheHandle[indexOfValueRelativeToCoordinates] === undefined) ? arrayOfValuesForTheHandle[arrayOfValuesForTheHandle.length - 1] : arrayOfValuesForTheHandle[indexOfValueRelativeToCoordinates];
    } else {
      if (isFirstElementPeaked) {
        newValue = (this.modelData.valueRange - this.modelData.step);
      } else {
        newValue = (arrayOfValuesForTheHandle[indexOfValueRelativeToCoordinates] === undefined) ? arrayOfValuesForTheHandle[arrayOfValuesForTheHandle.length - 1] : arrayOfValuesForTheHandle[indexOfValueRelativeToCoordinates];
      }
    }
    return newValue;
  }
  _createAnArrayOfValidValues() {
    let currentValue = 0;
    let theBeginning = this.modelData.minimum;
    const theFinish = this.modelData.maximum;
    const arrayOfValuesForTheHandle = [];
    while (currentValue < theFinish) {
      if (theBeginning > theFinish) {
        break;
      } else {
        currentValue = theBeginning;
        theBeginning += this.modelData.step;
        arrayOfValuesForTheHandle.push(currentValue);
      }
    }
    return arrayOfValuesForTheHandle;
  }
}

export default Model;
