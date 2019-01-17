import $ from 'jquery';
import EventEmitter from '../eventEmiter/eventEmiter';

class ViewSlider extends EventEmitter {
  constructor($element) {
    super();
    super.addEmitter(this.constructor.name);

    this.$slider = $element;
    this.isHandleMovingNow = false;
  }

  initSlider() {
    this._createSliderElement();
    this.$sliderScale = this.$slider.find('.js-slider__element');
    this.$firstHandle = this.$slider.find('.js-slider__handle_first');
    this.$firstTooltip = this.$slider.find('.js-slider__tooltip_first');
    this.$secondHandle = this.$slider.find('.js-slider__handle_second');
    this.$secondTooltip = this.$slider.find('.js-slider__tooltip_second');

    this.scaleWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();

    this._initEventListeners();
  }

  updateSlider(dataForUpdateSlider) {
    this.firstHandleValue = dataForUpdateSlider.firstValue;
    this.secondHandleValue = dataForUpdateSlider.secondValue;
    this.minimum = dataForUpdateSlider.minimum;
    this.maximum = dataForUpdateSlider.maximum;
    this.step = dataForUpdateSlider.step;
    this.areTooltipsVisible = dataForUpdateSlider.areTooltipsVisible;
    this.isVerticalOrientation = dataForUpdateSlider.isVerticalOrientation;
    this.hasIntervalSelection = dataForUpdateSlider.hasIntervalSelection;

    this._setTooltipsVisibility(this.areTooltipsVisible);
    this._setOrientation(this.isVerticalOrientation);
    this._setIntervalSelection(this.hasIntervalSelection);

    this._setHandlePosition(this.$firstHandle, this.$firstTooltip, this.firstHandleValue);
    if (this.hasIntervalSelection) {
      this._setHandlePosition(this.$secondHandle, this.$secondTooltip, this.secondHandleValue);
    }
  }

  _updateValuesWhenClick(coordinates) {
    const calculatedValue = this._calculateValueForHandle(coordinates);
    const firstHandlePosition = this._calculateNewPosition(this.firstHandleValue);
    const secondHandlePosition = this._calculateNewPosition(this.secondHandleValue);

    if (this.hasIntervalSelection) {
      const isNewPositionCloserToSecondElement = (coordinates - firstHandlePosition) > (secondHandlePosition - coordinates);
      const isNewPositionCloserToFirstElement = (coordinates - firstHandlePosition) < (secondHandlePosition - coordinates);
      if (isNewPositionCloserToSecondElement) {
        this.secondHandleValue = parseInt(calculatedValue);
      } else if (isNewPositionCloserToFirstElement) {
        this.firstHandleValue = parseInt(calculatedValue);
      }
    } else {
      this.firstHandleValue = parseInt(calculatedValue);
    }

    this._sendDataForUpdateState();
  }

  _updateValuesWhenMove(dataForSearchPosition) {
    const calculatedValue = this._calculateValueForHandle(dataForSearchPosition.coordinates);
    const firstHandlePosition = this._calculateNewPosition(this.firstHandleValue);
    const secondHandlePosition = this._calculateNewPosition(this.secondHandleValue);

    if (this.hasIntervalSelection) {
      if (dataForSearchPosition.elementType === 'first') {
        if (dataForSearchPosition.coordinates >= secondHandlePosition - this.stepWidth) {
          return;
        } else if (dataForSearchPosition.coordinates <= secondHandlePosition) {
          this.firstHandleValue = parseInt(calculatedValue);
        }
      } else if (dataForSearchPosition.elementType === 'second') {
        if (dataForSearchPosition.coordinates <= firstHandlePosition + this.stepWidth) {
          return;
        } else if (dataForSearchPosition.coordinates >= firstHandlePosition) {
          this.secondHandleValue = parseInt(calculatedValue);
        }
      }
    } else {
      this.firstHandleValue = parseInt(calculatedValue);
    }
    this._sendDataForUpdateState();
  }

  _calculateValueForHandle(coordinates) {
    const arrayOfPossibleHandleValues = this._createAnArrayOfPossibleHandleValues();
    this.stepWidth = this.scaleWidth / (arrayOfPossibleHandleValues.length - 1);
    if (coordinates <= 0) {
      coordinates = 0;
    } else if (coordinates >= this.scaleWidth) {
      coordinates = this.scaleWidth;
    }

    const indexOfValueToCoordinates = (((coordinates) + (this.stepWidth / 2)) / this.stepWidth) ^ 0;
    const isFirstElementPeaked = this.hasIntervalSelection && (indexOfValueToCoordinates >= arrayOfPossibleHandleValues.indexOf(this.secondHandleValue - this.step));

    let newValue;
    if (this.hasIntervalSelection) {
      newValue = (arrayOfPossibleHandleValues[indexOfValueToCoordinates] === undefined)
        ? arrayOfPossibleHandleValues[arrayOfPossibleHandleValues.length - 1]
        : arrayOfPossibleHandleValues[indexOfValueToCoordinates];
    } else {
      if (isFirstElementPeaked) {
        newValue = (this.secondHandleValue - this.step);
      } else {
        newValue = (arrayOfPossibleHandleValues[indexOfValueToCoordinates] === undefined)
          ? arrayOfPossibleHandleValues[arrayOfPossibleHandleValues.length - 1]
          : arrayOfPossibleHandleValues[indexOfValueToCoordinates];
      }
    }
    return newValue;
  }

  _createAnArrayOfPossibleHandleValues() {
    let currentValue = this.minimum;
    const arrayOfPossibleHandleValues = [];

    while (currentValue <= this.maximum) {
      arrayOfPossibleHandleValues.push(currentValue);
      if (currentValue > this.maximum) {
        break;
      } else {
        currentValue += this.step;
      }
    }
    return arrayOfPossibleHandleValues;
  }

  _calculateNewPosition(value) {
    const arrayOfPossibleHandleValues = this._createAnArrayOfPossibleHandleValues();
    this.stepWidth = this.scaleWidth / (arrayOfPossibleHandleValues.length - 1);
    let handlePosition = this.stepWidth * (arrayOfPossibleHandleValues.indexOf(value));

    if (handlePosition <= 0) {
      handlePosition = 0;
    } else if (handlePosition >= this.scaleWidth) {
      handlePosition = this.scaleWidth;
    }
    return handlePosition;
  }

  _sendDataForUpdateState() {
    const dataForUpdateState = {
      firstValue: this.firstHandleValue,
      secondValue: this.secondHandleValue,
      minimum: this.minimum,
      maximum: this.maximum,
      step: this.step,
      areTooltipsVisible: this.areTooltipsVisible,
      isVerticalOrientation: this.isVerticalOrientation,
      hasIntervalSelection: this.hasIntervalSelection,
    };

    this.notify('updateState', dataForUpdateState);
  }

  _initEventListeners() {
    this.$sliderScale.click(this._handleSliderScaleClick.bind(this));
    this.$firstHandle.mousedown(this._handleHandleMouseDown.bind(this));
    this.$secondHandle.mousedown(this._handleHandleMouseDown.bind(this));

    $(document).mousemove(this._handleHandleMouseMove.bind(this));


    $(document).mouseup(() => {
      this.isHandleMovingNow = false;
      this.dataForMovingHandle = null;
    });
  }

  _handleHandleMouseDown(e) {
    const sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);
    const handleCoordinates = this._getCoordinatesOfElementInsideWindow($(e.currentTarget));

    const cursorPositionInsideHandle = this.isVerticalOrientation
      ? e.pageY - handleCoordinates.top
      : e.pageX - handleCoordinates.left;

    this.isHandleMovingNow = true;
    const $currentHandle = $(e.currentTarget);

    this.dataForMovingHandle = { $currentHandle, sliderCoordinates, cursorPositionInsideHandle };
  }

  _handleHandleMouseMove(e) {
    if (this.isHandleMovingNow) {
      const { $currentHandle, sliderCoordinates, cursorPositionInsideHandle } = { ...this.dataForMovingHandle };

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
  }

  _handleSliderScaleClick(e) {
    const sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);

    const distanceFromLeftEdgeOfScale = parseInt(e.pageX - sliderCoordinates.left - (this.$firstHandle.outerWidth() / 2));
    const distanceFromTopOfScale = parseInt(e.pageY - sliderCoordinates.top - (this.$firstHandle.outerHeight() / 2));

    const coordinatesOfClick = this.isVerticalOrientation
      ? distanceFromTopOfScale
      : distanceFromLeftEdgeOfScale;

    this._updateValuesWhenClick(coordinatesOfClick);
  }

  _setHandlePosition($currentHandle, $currentTooltip, value) {
    $currentHandle.css('left', `${this._calculateNewPosition(value)}px`);
    $currentTooltip.html(value);
  }

  _getCoordinatesOfElementInsideWindow(element) {
    const { top, left } = element.get(0).getBoundingClientRect();
    return {
      top: top + window.pageYOffset,
      left: left + window.pageXOffset,
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
