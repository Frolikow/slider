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
    const { firstValue, secondValue, minimum, maximum, step, areTooltipsVisible, isVerticalOrientation, hasIntervalSelection } = dataForUpdateSlider;

    this.firstHandleValue = firstValue;
    this.secondHandleValue = secondValue;
    this.minimum = minimum;
    this.maximum = maximum;
    this.step = step;
    this.areTooltipsVisible = areTooltipsVisible;
    this.isVerticalOrientation = isVerticalOrientation;
    this.hasIntervalSelection = hasIntervalSelection;

    this._setTooltipsVisibility(this.areTooltipsVisible);
    this._setOrientation(this.isVerticalOrientation);
    this._setIntervalSelection(this.hasIntervalSelection);

    this._setHandlePosition(this.$firstHandle, this.$firstTooltip, this.firstHandleValue);
    if (this.hasIntervalSelection) {
      this._setHandlePosition(this.$secondHandle, this.$secondTooltip, this.secondHandleValue);
    }
  }

  _updateValuesWhenClick(distanceFromStart) {
    const calculatedValue = this._calculateValueForHandle(distanceFromStart);
    const firstHandlePosition = this._calculateNewPosition(this.firstHandleValue);
    const secondHandlePosition = this._calculateNewPosition(this.secondHandleValue);

    if (this.hasIntervalSelection) {
      const isNewPositionCloserToSecondElement = (distanceFromStart - firstHandlePosition) > (secondHandlePosition - distanceFromStart);
      const isNewPositionCloserToFirstElement = (distanceFromStart - firstHandlePosition) < (secondHandlePosition - distanceFromStart);
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
    const { distanceFromStart, elementType } = dataForSearchPosition;

    const calculatedValue = this._calculateValueForHandle(distanceFromStart);
    const firstHandlePosition = this._calculateNewPosition(this.firstHandleValue);
    const secondHandlePosition = this._calculateNewPosition(this.secondHandleValue);

    if (this.hasIntervalSelection) {
      if (elementType === 'first') {
        if (distanceFromStart >= secondHandlePosition - this.stepWidth) {
          return;
        } else if (distanceFromStart <= secondHandlePosition) {
          this.firstHandleValue = parseInt(calculatedValue);
        }
      } else if (elementType === 'second') {
        if (distanceFromStart <= firstHandlePosition + this.stepWidth) {
          return;
        } else if (distanceFromStart >= firstHandlePosition) {
          this.secondHandleValue = parseInt(calculatedValue);
        }
      }
    } else {
      this.firstHandleValue = parseInt(calculatedValue);
    }
    this._sendDataForUpdateState();
  }

  _calculateValueForHandle(distanceFromStart) {
    if (distanceFromStart <= 0) {
      distanceFromStart = 0;
    } else if (distanceFromStart >= this.scaleWidth) {
      distanceFromStart = this.scaleWidth;
    }

    const arrayPossibleHandleValues = this._createArrayPossibleHandleValues();
    this.stepWidth = this.scaleWidth / (arrayPossibleHandleValues.length - 1);
    const indexValueToDistanceFromStart = Math.round((distanceFromStart) / this.stepWidth);

    const newValue = arrayPossibleHandleValues[indexValueToDistanceFromStart];

    return newValue;
  }

  _createArrayPossibleHandleValues() {
    let currentValue = this.minimum;
    const arrayPossibleHandleValues = [];

    while (currentValue <= this.maximum) {
      arrayPossibleHandleValues.push(currentValue);
      currentValue += this.step;
    }
    return arrayPossibleHandleValues;
  }

  _calculateNewPosition(value) {
    const arrayPossibleHandleValues = this._createArrayPossibleHandleValues();
    this.stepWidth = this.scaleWidth / (arrayPossibleHandleValues.length - 1);
    let handlePosition = this.stepWidth * (arrayPossibleHandleValues.indexOf(value));

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
    this.$firstHandle.mousedown(this._handleHandleMousedown.bind(this));
    this.$secondHandle.mousedown(this._handleHandleMousedown.bind(this));

    $(document).mousemove(this._handleDocumentMousemove.bind(this));


    $(document).mouseup(this._handleDocumentMouseup.bind(this));
  }

  _handleDocumentMouseup() {
    this.isHandleMovingNow = false;
    this.dataForMovingHandle = null;
  }

  _handleHandleMousedown(e) {
    const sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);
    const handleCoordinates = this._getCoordinatesOfElementInsideWindow($(e.currentTarget));

    const cursorPositionInsideHandle = this.isVerticalOrientation
      ? e.pageY - handleCoordinates.top
      : e.pageX - handleCoordinates.left;

    this.isHandleMovingNow = true;

    this.dataForMovingHandle = { $currentHandle: $(e.currentTarget), sliderCoordinates, cursorPositionInsideHandle };
  }

  _handleDocumentMousemove(e) {
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
      const dataForSearchPosition = { distanceFromStart: coordinatesOfClickInSlider, elementType };
      this._updateValuesWhenMove(dataForSearchPosition);
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
