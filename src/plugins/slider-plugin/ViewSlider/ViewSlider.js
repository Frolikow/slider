import $ from 'jquery';
import EventEmitter from '../eventEmiter/eventEmiter';

class ViewSlider extends EventEmitter {
  constructor() {
    super();
    super.addEmitter(this.constructor.name);
  }

  initSlider(options) {
    this.$slider = options.$slider;

    this._createSliderElement();
    this.$sliderScale = this.$slider.find('.js-slider__element');
    this.$firstHandle = this.$slider.find('.js-slider__handle_first');
    this.$firstTooltip = this.$slider.find('.js-slider__tooltip_first');
    this.$secondHandle = this.$slider.find('.js-slider__handle_second');
    this.$secondTooltip = this.$slider.find('.js-slider__tooltip_second');

    this.scaleWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();

    this._initEventListeners();

    this.updateSlider(options);
  }

  updateSlider(dataForUpdatePanel) {
    this.sliderState = { ...dataForUpdatePanel };
    delete this.sliderState.$slider;

    this._setTooltipsVisibility(this.sliderState.areTooltipsVisible);
    this._setOrientation(this.sliderState.isVerticalOrientation);
    this._setIntervalSelection(this.sliderState.hasIntervalSelection);

    this._setFirstHandlePosition(
      this.sliderState.value,
      this.sliderState.minimum,
      this.sliderState.maximum,
      this.sliderState.step,
    );
    if (this.sliderState.hasIntervalSelection) {
      this._setSecondHandlePosition(
        this.sliderState.valueRange,
        this.sliderState.minimum,
        this.sliderState.maximum,
        this.sliderState.step,
      );
    }
  }

  _updateValuesWhenClick(coordinates) {
    const calculatedValue = this._calculateValueForHandle(coordinates);
    this.firstHandlePosition = this._calculateNewPosition(this.sliderState.value, this.sliderState.minimum, this.sliderState.maximum, this.sliderState.step);
    this.secondHandlePosition = this._calculateNewPosition(this.sliderState.valueRange, this.sliderState.minimum, this.sliderState.maximum, this.sliderState.step);

    if (this.sliderState.hasIntervalSelection) {
      const isNewPositionCloserToSecondElement = (coordinates - this.firstHandlePosition) > (this.secondHandlePosition - coordinates);
      const isNewPositionCloserToFirstElement = (coordinates - this.firstHandlePosition) < (this.secondHandlePosition - coordinates);
      if (isNewPositionCloserToSecondElement) {
        this.sliderState.valueRange = parseInt(calculatedValue);
      } else if (isNewPositionCloserToFirstElement) {
        this.sliderState.value = parseInt(calculatedValue);
      }
    } else {
      this.sliderState.value = parseInt(calculatedValue);
    }

    this._sendDataForUpdateState();
  }

  _updateValuesWhenMove(dataForSearchPosition) {
    const calculatedValue = this._calculateValueForHandle(dataForSearchPosition.coordinates);
    this.firstHandlePosition = this._calculateNewPosition(this.sliderState.value, this.sliderState.minimum, this.sliderState.maximum, this.sliderState.step);
    this.secondHandlePosition = this._calculateNewPosition(this.sliderState.valueRange, this.sliderState.minimum, this.sliderState.maximum, this.sliderState.step);

    if (this.sliderState.hasIntervalSelection) {
      if (dataForSearchPosition.elementType === 'first') {
        if (dataForSearchPosition.coordinates >= this.secondHandlePosition - this.stepWidth) {
          return;
        } else if (dataForSearchPosition.coordinates <= this.secondHandlePosition) {
          this.sliderState.value = parseInt(calculatedValue);
        }
      } else if (dataForSearchPosition.elementType === 'second') {
        if (dataForSearchPosition.coordinates <= this.firstHandlePosition + this.stepWidth) {
          return;
        } else if (dataForSearchPosition.coordinates >= this.firstHandlePosition) {
          this.sliderState.valueRange = parseInt(calculatedValue);
        }
      }
    } else {
      this.sliderState.value = parseInt(calculatedValue);
    }
    this._sendDataForUpdateState();
  }

  _calculateValueForHandle(coordinates) {
    const arrayOfValuesForHandle = this._createAnArrayOfValidValues();
    this.stepWidth = this.scaleWidth / (arrayOfValuesForHandle.length - 1);
    if (coordinates <= 0) {
      coordinates = 0;
    } else if (coordinates >= this.scaleWidth) {
      coordinates = this.scaleWidth;
    }

    const indexOfValueToCoordinates = (((coordinates) + (this.stepWidth / 2)) / this.stepWidth) ^ 0;
    const isFirstElementPeaked = this.sliderState.hasIntervalSelection && (indexOfValueToCoordinates >= arrayOfValuesForHandle.indexOf(this.sliderState.valueRange - this.sliderState.step));

    let newValue;
    if (this.sliderState.hasIntervalSelection) {
      newValue = (arrayOfValuesForHandle[indexOfValueToCoordinates] === undefined)
        ? arrayOfValuesForHandle[arrayOfValuesForHandle.length - 1]
        : arrayOfValuesForHandle[indexOfValueToCoordinates];
    } else {
      if (isFirstElementPeaked) {
        newValue = (this.sliderState.valueRange - this.sliderState.step);
      } else {
        newValue = (arrayOfValuesForHandle[indexOfValueToCoordinates] === undefined)
          ? arrayOfValuesForHandle[arrayOfValuesForHandle.length - 1]
          : arrayOfValuesForHandle[indexOfValueToCoordinates];
      }
    }
    return newValue;
  }

  _createAnArrayOfValidValues() {
    let currentValue = 0;
    let beginning = this.sliderState.minimum;
    const finish = this.sliderState.maximum;
    const arrayOfValuesForHandle = [];

    while (currentValue < finish) {
      if (beginning > finish) {
        break;
      } else {
        currentValue = beginning;
        beginning += this.sliderState.step;
        arrayOfValuesForHandle.push(currentValue);
      }
    }
    return arrayOfValuesForHandle;
  }

  _calculateNewPosition(value) {
    const arrayOfValuesForHandle = this._createAnArrayOfValidValues();
    this.stepWidth = this.scaleWidth / (arrayOfValuesForHandle.length - 1);
    let handlePosition = this.stepWidth * (arrayOfValuesForHandle.indexOf(value));

    if (handlePosition <= 0) {
      handlePosition = 0;
    } else if (handlePosition >= this.scaleWidth) {
      handlePosition = this.scaleWidth;
    }

    if (value === this.sliderState.value) {
      if (arrayOfValuesForHandle.includes(value) === false) {
        handlePosition = 0;
      }
    } else if (value === this.sliderState.valueRange) {
      if (arrayOfValuesForHandle.includes(value) === false) {
        handlePosition = this.scaleWidth;
      }
    }
    return handlePosition;
  }

  _sendDataForUpdateState() {
    const dataForUpdateState = this.sliderState;

    this.notify('updateState', dataForUpdateState);
  }

  _initEventListeners() {
    this.$sliderScale.click(this._handleSliderScaleClick.bind(this));
    this.$firstHandle.mousedown(this._handleHandleMouseDown.bind(this));
    this.$secondHandle.mousedown(this._handleHandleMouseDown.bind(this));
    $(document).mouseup(() => { $(document).off('mousemove'); });
  }

  _handleHandleMouseDown(e) {
    const sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);
    const handleCoordinates = this._getCoordinatesOfElementInsideWindow($(e.currentTarget));

    const cursorPositionInsideHandle = this.isVerticalOrientation
      ? e.pageY - handleCoordinates.top
      : e.pageX - handleCoordinates.left;

    $(document).mousemove(this._handleHandleMouseMove.bind(this, $(e.currentTarget), sliderCoordinates, cursorPositionInsideHandle));
  }

  _handleHandleMouseMove($currentHandle, sliderCoordinates, cursorPositionInsideHandle, e) {
    const coordinatesOfClickInSlider = this.isVerticalOrientation
      ? e.pageY - cursorPositionInsideHandle - sliderCoordinates.top
      : e.pageX - cursorPositionInsideHandle - sliderCoordinates.left;

    let elementType;
    if ($currentHandle.hasClass('js-slider__handle_first')) {
      elementType = 'first';
    } else if ($currentHandle.hasClass('js-slider__handle_second')) {
      elementType = 'second';
    }

    const dataForPositionSearch = { coordinates: coordinatesOfClickInSlider, elementType };
    this._updateValuesWhenMove(dataForPositionSearch);
  }

  _handleSliderScaleClick(e) {
    const sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);
    const coordinatesOfClick = this.isVerticalOrientation ? parseInt(e.pageY - sliderCoordinates.top - (this.$firstHandle.outerHeight() / 2)) : parseInt(e.pageX - sliderCoordinates.left - (this.$firstHandle.outerWidth() / 2));

    this._updateValuesWhenClick(coordinatesOfClick);
  }

  _setFirstHandlePosition(value, minimum, maximum, step) {
    this.$firstHandle.css('left', `${this._calculateNewPosition(value, minimum, maximum, step)}px`);
    this.$firstTooltip.html(value);
  }

  _setSecondHandlePosition(value, minimum, maximum, step) {
    this.$secondHandle.css('left', `${this._calculateNewPosition(value, minimum, maximum, step)}px`);
    this.$secondTooltip.html(value);
  }

  _getCoordinatesOfElementInsideWindow(element) {
    const box = element.get(0).getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }

  _setTooltipsVisibility(switchedOn) {
    if (switchedOn) {
      this.$firstTooltip.removeClass('slider__tooltip_hidden');
      this.$secondTooltip.removeClass('slider__tooltip_hidden');
      this.$firstTooltip.addClass('slider__tooltip_visible');
      this.$secondTooltip.addClass('slider__tooltip_visible');
    } else {
      this.$firstTooltip.removeClass('slider__tooltip_visible');
      this.$secondTooltip.removeClass('slider__tooltip_visible');
      this.$firstTooltip.addClass('slider__tooltip_hidden');
      this.$secondTooltip.addClass('slider__tooltip_hidden');
    }
  }

  _setOrientation(switchedOn) {
    if (switchedOn) {
      this.$sliderScale.addClass('slider__element_vertical');
      this.$firstHandle.addClass('slider__handle_vertical');
      this.$firstTooltip.addClass('slider__tooltip_vertical');
      this.$secondHandle.addClass('slider__handle_vertical');
      this.$secondTooltip.addClass('slider__tooltip_vertical');
    } else {
      this.$sliderScale.removeClass('slider__element_vertical');
      this.$firstHandle.removeClass('slider__handle_vertical');
      this.$firstTooltip.removeClass('slider__tooltip_vertical');
      this.$secondHandle.removeClass('slider__handle_vertical');
      this.$secondTooltip.removeClass('slider__tooltip_vertical');
    }
  }

  _setIntervalSelection(switchedOn) {
    if (switchedOn) {
      this.$secondHandle.addClass('slider__handle_visible');
      this.$secondHandle.removeClass('slider__handle_hidden');
    } else {
      this.$secondHandle.removeClass('slider__handle_visible');
      this.$secondHandle.addClass('slider__handle_hidden');
    }
  }

  _createSliderElement() {
    const bookListingTemplate = require('./sliderTemplate.hbs');
    const $sliderElement = document.createElement('div');
    $sliderElement.className = 'slider__element js-slider__element';

    $sliderElement.innerHTML = bookListingTemplate({
      handles: [{
        className: 'slider__handle slider__handle_first js-slider__handle_first',
        tooltip: [{
          className: 'slider__tooltip slider__tooltip_first js-slider__tooltip_first',
        }],
      }, {
        className: 'slider__handle slider__handle_second js-slider__handle_second',
        tooltip: [{
          className: 'slider__tooltip slider__tooltip_second js-slider__tooltip_second',
        }],
      }],
    });

    this.$slider.append($sliderElement);
  }
}

export default ViewSlider;
