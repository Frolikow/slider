import EventEmitter from '../eventEmiter/eventEmiter';

class Model extends EventEmitter {
  constructor(options) {
    super();
    super.addEmitter(this.constructor.name);

    this.modelData = { ...options };

    // value: options.value,
    // valueRange: options.valueRange,
    // minimum: options.minimum,
    // maximum: options.maximum,
    // step: options.step,
    // rangeStatus: options.rangeStatus,
    // visibilityTooltips: options.visibilityTooltips,
    // verticalOrientation: options.verticalOrientation,
    this.relativeSliderWidth = 1000;

    this._checkIncomingData();
  }

  updateState(newDataToUpdateState) {
    this.modelData = { ...this.modelData, ...newDataToUpdateState };
    this._checkIncomingData();
    this.sendNewDataFromModel();
  }
  sendNewDataFromModel() {
    const firstRelativePosition = this._calculateRelativePosition(this.modelData.value);
    const secondRelativePosition = this._calculateRelativePosition(this.modelData.valueRange);
    const firstValue = this._calculateValueForHandle(firstRelativePosition);
    const secondValue = this._calculateValueForHandle(secondRelativePosition);

    const newData = {
      ...this.modelData,
      value: firstValue,
      valueRange: secondValue,
      firstRelativePosition,
      secondRelativePosition,
    };
    this.notify('sendNewDataFromModel', newData);
  }

  updateValuesForStaticCoordinates(relativeCoordinates) {
    const calculatedValue = this._calculateValueForHandle(relativeCoordinates);
    this.firstRelativePosition = this._calculateRelativePosition(this.modelData.value);
    this.secondRelativePosition = this._calculateRelativePosition(this.modelData.valueRange);

    if (this.modelData.rangeStatus) {
      const newPositionCloserToSecondElement = (relativeCoordinates - this.firstRelativePosition) > (this.secondRelativePosition - relativeCoordinates);
      const newPositionCloserToFirstElement = (relativeCoordinates - this.firstRelativePosition) < (this.secondRelativePosition - relativeCoordinates);
      if (newPositionCloserToSecondElement) {
        this.modelData.valueRange = parseInt(calculatedValue);
      } else if (newPositionCloserToFirstElement) {
        this.modelData.value = parseInt(calculatedValue);
      }
    } else {
      this.modelData.value = parseInt(calculatedValue);
    }
    this.sendNewDataFromModel();
  }

  updateValuesForDynamicCoordinates(dataForSearchPosition) {
    const calculatedValue = this._calculateValueForHandle(dataForSearchPosition.relativeCoordinates);
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
    const isValueOfStepWithinAllowedInterval = (this.modelData.step < 1 || this.modelData.step > (this.modelData.maximum - this.modelData.minimum));
    if (isValueOfStepWithinAllowedInterval) {
      this.modelData.step = 1;
      console.log('Неккоректное значение step \nОбязательное условие: \nstep >=1 && step <= (maximum - minimum) \nИзменено на step = 1.');
    }
    const isValuesWithinAllowedInterval = this.modelData.value > this.modelData.maximum || this.modelData.value < this.modelData.minimum;
    if (isValuesWithinAllowedInterval) {
      this.modelData.value = this.modelData.minimum;
      this.modelData.valueRange = this.modelData.maximum;
      console.log('Неккоректные значения value \nОбязательное условие: \nminimum <= value <= maximum \nИзменено на value = minimum, valueRange = maximum.');
    }
    if (this.modelData.rangeStatus) {
      const isValueOfSecondElementIsLargerThanMaximum = this.modelData.valueRange > this.modelData.maximum;
      if (isValueOfSecondElementIsLargerThanMaximum) {
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
    const arrayOfValuesForHandle = this._createAnArrayOfValidValues();

    this.relativeStepWidth = this.relativeSliderWidth / (arrayOfValuesForHandle.length - 1);
    let relativePosition = this.relativeStepWidth * (arrayOfValuesForHandle.indexOf(elementValueForPositionCalculation));

    if (relativePosition <= 0) {
      relativePosition = 0;
    } else if (relativePosition >= this.relativeSliderWidth) {
      relativePosition = this.relativeSliderWidth;
    }
    if (elementValueForPositionCalculation === this.modelData.value) {
      if (arrayOfValuesForHandle.includes(elementValueForPositionCalculation) === false) {
        relativePosition = 0;
      }
    } else if (elementValueForPositionCalculation === this.modelData.valueRange) {
      if (arrayOfValuesForHandle.includes(elementValueForPositionCalculation) === false) {
        relativePosition = this.relativeSliderWidth;
      }
    }
    return relativePosition;
  }
  _calculateValueForHandle(relativeCoordinates) {
    const arrayOfValuesForHandle = this._createAnArrayOfValidValues();
    if (relativeCoordinates <= 0) {
      relativeCoordinates = 0;
    } else if (relativeCoordinates >= this.relativeSliderWidth) {
      relativeCoordinates = this.relativeSliderWidth;
    }

    const indexOfValueRelativeToCoordinates = (((relativeCoordinates) + (this.relativeStepWidth / 2)) / this.relativeStepWidth) ^ 0;

    const isFirstElementPeaked = this.modelData.rangeStatus && (indexOfValueRelativeToCoordinates >= arrayOfValuesForHandle.indexOf(this.modelData.valueRange - this.modelData.step));
    let newValue;
    if (this.modelData.rangeStatus) {
      newValue = (arrayOfValuesForHandle[indexOfValueRelativeToCoordinates] === undefined) ? arrayOfValuesForHandle[arrayOfValuesForHandle.length - 1] : arrayOfValuesForHandle[indexOfValueRelativeToCoordinates];
    } else {
      if (isFirstElementPeaked) {
        newValue = (this.modelData.valueRange - this.modelData.step);
      } else {
        newValue = (arrayOfValuesForHandle[indexOfValueRelativeToCoordinates] === undefined) ? arrayOfValuesForHandle[arrayOfValuesForHandle.length - 1] : arrayOfValuesForHandle[indexOfValueRelativeToCoordinates];
      }
    }
    return newValue;
  }
  _createAnArrayOfValidValues() {
    let currentValue = 0;
    let beginning = this.modelData.minimum;
    const finish = this.modelData.maximum;
    const arrayOfValuesForHandle = [];
    while (currentValue < finish) {
      if (beginning > finish) {
        break;
      } else {
        currentValue = beginning;
        beginning += this.modelData.step;
        arrayOfValuesForHandle.push(currentValue);
      }
    }
    return arrayOfValuesForHandle;
  }
}

export default Model;
