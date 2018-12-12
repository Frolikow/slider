import EventEmitter from '../eventEmiter/eventEmiter';
import { validateInitialData, validateIncomingData } from './modelDataValidators';

class Model extends EventEmitter {
  constructor(options) {
    super();
    super.addEmitter(this.constructor.name);

    this.modelData = validateInitialData(options);

    this.relativeSliderWidth = 1000;
  }

  updateState(newDataToUpdateState) {
    this.modelData = validateIncomingData(newDataToUpdateState);

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

    if (this.modelData.hasIntervalSelection) {
      const isNewPositionCloserToSecondElement = (relativeCoordinates - this.firstRelativePosition) > (this.secondRelativePosition - relativeCoordinates);
      const isNewPositionCloserToFirstElement = (relativeCoordinates - this.firstRelativePosition) < (this.secondRelativePosition - relativeCoordinates);
      if (isNewPositionCloserToSecondElement) {
        this.modelData.valueRange = parseInt(calculatedValue);
      } else if (isNewPositionCloserToFirstElement) {
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

    if (this.modelData.hasIntervalSelection) {
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
    const isFirstElementPeaked = this.modelData.hasIntervalSelection && (indexOfValueRelativeToCoordinates >= arrayOfValuesForHandle.indexOf(this.modelData.valueRange - this.modelData.step));

    let newValue;
    if (this.modelData.hasIntervalSelection) {
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
