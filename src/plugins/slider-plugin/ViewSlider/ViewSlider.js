import $ from 'jquery';
import EventEmitter from '../eventEmiter/eventEmiter';
import createArrayOfPossibleHandleValues from '../shared';

class ViewSlider extends EventEmitter {
  constructor($element) {
    super();
    super.addEmitter(this.constructor.name);

    this.$slider = $element;
    this.selectedHandleState = null;
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
    this.areTooltipsVisible = areTooltipsVisible;
    this.isVerticalOrientation = isVerticalOrientation;
    this.hasIntervalSelection = hasIntervalSelection;

    this._setTooltipsVisibility(this.areTooltipsVisible);
    this._setOrientation(this.isVerticalOrientation);
    this._setIntervalSelection(this.hasIntervalSelection);

    this.sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);
    this.arrayOfPossibleHandleValues = createArrayOfPossibleHandleValues(minimum, maximum, step);
    this.stepWidth = this.scaleWidth / (this.arrayOfPossibleHandleValues.length - 1);

    this._setHandlePosition(this.$firstHandle, this.$firstTooltip, this.firstHandleValue);
    if (this.hasIntervalSelection) {
      this._setHandlePosition(this.$secondHandle, this.$secondTooltip, this.secondHandleValue);
    }
    this._fillScale();
  }

  _updateValuesWhenClick(distanceFromStart) {
    const calculatedValue = this._calculateValueForHandle(distanceFromStart);
    const firstHandlePosition = this._calculateHandlePosition(this.firstHandleValue);
    const secondHandlePosition = this._calculateHandlePosition(this.secondHandleValue);

    if (this.hasIntervalSelection) {
      const isNewPositionCloserToFirstHandle = (distanceFromStart - firstHandlePosition) < (secondHandlePosition - distanceFromStart);
      if (isNewPositionCloserToFirstHandle) {
        this.firstHandleValue = parseInt(calculatedValue);
      } else {
        this.secondHandleValue = parseInt(calculatedValue);
      }
    } else {
      this.firstHandleValue = parseInt(calculatedValue);
    }
    this._sendDataForUpdateState();
  }

  _updateValuesWhenMove(distanceFromStart) {
    const calculatedValue = this._calculateValueForHandle(distanceFromStart);
    const firstHandlePosition = this._calculateHandlePosition(this.firstHandleValue);
    const secondHandlePosition = this._calculateHandlePosition(this.secondHandleValue);
    const { elementType } = this.selectedHandleState;

    if (this.hasIntervalSelection) {
      const valueForHandleFirstIsChangeable = distanceFromStart <= secondHandlePosition - this.stepWidth;
      const valueForHandleSecondIsChangeable = distanceFromStart >= firstHandlePosition + this.stepWidth;

      if (elementType === 'first' && valueForHandleFirstIsChangeable) {
        this.firstHandleValue = parseInt(calculatedValue);
      } else if (elementType === 'second' && valueForHandleSecondIsChangeable) {
        this.secondHandleValue = parseInt(calculatedValue);
      }
    } else {
      this.firstHandleValue = parseInt(calculatedValue);
    }

    this._sendDataForUpdateState();
  }

  _calculateValueForHandle(distanceFromStart) {
    const indexValueToDistanceFromStart = Math.round(this._validatePositionForHandle(distanceFromStart) / this.stepWidth);
    const newHandleValue = this.arrayOfPossibleHandleValues[indexValueToDistanceFromStart];

    return newHandleValue;
  }

  _validatePositionForHandle(position) {
    if (position <= 0) {
      return 0;
    } else if (position >= this.scaleWidth) {
      return this.scaleWidth;
    }
    return position;
  }

  _calculateHandlePosition(value) {
    const handlePosition = this.stepWidth * (this.arrayOfPossibleHandleValues.indexOf(value));
    return handlePosition;
  }

  _sendDataForUpdateState() {
    const dataForUpdateState = {
      firstValue: this.firstHandleValue,
      secondValue: this.secondHandleValue,
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
    this.selectedHandleState = null;
  }

  _handleHandleMousedown(e) {
    const $currentHandle = $(e.currentTarget);
    const handleCoordinates = this._getCoordinatesOfElementInsideWindow($currentHandle);

    const cursorPositionInsideHandle = this.isVerticalOrientation
      ? e.pageY - handleCoordinates.top
      : e.pageX - handleCoordinates.left;

    const elementType = $currentHandle.hasClass('js-slider__handle_first')
      ? 'first'
      : 'second';

    this.selectedHandleState = { cursorPositionInsideHandle, elementType };
  }

  _handleDocumentMousemove(e) {
    if (this.selectedHandleState !== null) {
      const { cursorPositionInsideHandle } = this.selectedHandleState;

      const distanceFromStart = this.isVerticalOrientation
        ? e.pageY - cursorPositionInsideHandle - this.sliderCoordinates.top
        : e.pageX - cursorPositionInsideHandle - this.sliderCoordinates.left;

      this._updateValuesWhenMove(distanceFromStart);
    }
  }

  _handleSliderScaleClick(e) {
    const distanceFromLeftEdgeOfScale = parseInt(e.pageX - this.sliderCoordinates.left - (this.$firstHandle.outerWidth() / 2));
    const distanceFromTopOfScale = parseInt(e.pageY - this.sliderCoordinates.top - (this.$firstHandle.outerHeight() / 2));

    const coordinatesOfClick = this.isVerticalOrientation
      ? distanceFromTopOfScale
      : distanceFromLeftEdgeOfScale;

    this._updateValuesWhenClick(coordinatesOfClick);
  }

  _setHandlePosition($currentHandle, $currentTooltip, value) {
    $currentHandle.css('left', `${this._calculateHandlePosition(value)}px`);
    $currentTooltip.html(value);
  }

  _getCoordinatesOfElementInsideWindow(element) {
    const { top, left } = element.get(0).getBoundingClientRect();
    return {
      top: top + window.pageYOffset,
      left: left + window.pageXOffset,
    };
  }

  _fillScale() {
    const sliderScaleCoordinates = this.isVerticalOrientation
      ? this._getCoordinatesOfElementInsideWindow(this.$sliderScale).top
      : this._getCoordinatesOfElementInsideWindow(this.$sliderScale).left;

    const firstHandleCoordinates = this.isVerticalOrientation
      ? this._getCoordinatesOfElementInsideWindow(this.$firstHandle).top
      : this._getCoordinatesOfElementInsideWindow(this.$firstHandle).left;

    const secondHandlePosition = this.isVerticalOrientation
      ? this._getCoordinatesOfElementInsideWindow(this.$secondHandle).top
      : this._getCoordinatesOfElementInsideWindow(this.$secondHandle).left;

    if (this.hasIntervalSelection) {
      const firstFillLimit = (100 / this.scaleWidth) * (firstHandleCoordinates - sliderScaleCoordinates);
      const secondFillLimit = (100 / this.scaleWidth) * (secondHandlePosition - sliderScaleCoordinates);

      this.$sliderScale.css('background', `linear-gradient(to right, #999 , #999 ${firstFillLimit}%, #f00 ${firstFillLimit}%, #f00 ${secondFillLimit}%, #999 ${secondFillLimit}%`);
    } else {
      const fillLimit = (100 / this.scaleWidth) * (firstHandleCoordinates - sliderScaleCoordinates);

      this.$sliderScale.css('background', `linear-gradient(to right, #f00, #f00 ${fillLimit}%, #999 ${fillLimit}%`);
    }
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
