/* eslint-disable function-paren-newline */
import $ from 'jquery';
import EventEmitter from '../eventEmiter/eventEmiter';
import createRange from '../shared';

class ViewSlider extends EventEmitter {
  constructor($element) {
    super();

    this.events = ['initSlider', 'updateSlider'];
    this.$slider = $element;
    this.selectedKnobState = null;
  }

  initSlider() {
    this._createSliderElement();
    this.$sliderScale = this.$slider.find('.js-slider__element');
    this.$firstKnob = this.$slider.find('.js-slider__knob_first');
    this.$firstTooltip = this.$slider.find('.js-slider__tooltip_first');
    this.$secondKnob = this.$slider.find('.js-slider__knob_second');
    this.$secondTooltip = this.$slider.find('.js-slider__tooltip_second');

    this.scaleWidth = this.$sliderScale.outerWidth() - this.$firstKnob.outerWidth();

    this._initEventListeners();
  }

  updateSlider({ firstValue, secondValue, minimum, maximum, step, areTooltipsVisible, isVerticalOrientation, hasIntervalSelection }) {
    this.firstKnobValue = firstValue;
    this.secondKnobValue = secondValue;
    this.maximum = maximum;
    this.areTooltipsVisible = areTooltipsVisible;
    this.isVerticalOrientation = isVerticalOrientation;
    this.hasIntervalSelection = hasIntervalSelection;

    this._setTooltipsVisibility(this.areTooltipsVisible);
    this._setOrientation(this.isVerticalOrientation);
    this._setIntervalSelection(this.hasIntervalSelection);

    this.sliderCoordinates = this._getElementCoordinates(this.$sliderScale);
    this.possibleSliderValues = createRange(minimum, maximum, step);
    this.stepWidth = (this.scaleWidth / (maximum - minimum)) * step;

    this._setKnobPosition(this.$firstKnob, this.$firstTooltip, this.firstKnobValue);
    if (this.hasIntervalSelection) {
      this._setKnobPosition(this.$secondKnob, this.$secondTooltip, this.secondKnobValue);
    }
    this._fillScale();
  }

  _updateValuesWhenClick(distanceFromStart) {
    const calculatedValue = this._calculateValueForKnob(distanceFromStart);
    const firstKnobPosition = this._calculateKnobPosition(this.firstKnobValue);
    const secondKnobPosition = this._calculateKnobPosition(this.secondKnobValue);

    if (this.hasIntervalSelection) {
      const isNewPositionCloserToFirstKnob = (distanceFromStart - firstKnobPosition) < (secondKnobPosition - distanceFromStart);
      if (isNewPositionCloserToFirstKnob) {
        this.firstKnobValue = parseInt(calculatedValue);
      } else {
        this.secondKnobValue = parseInt(calculatedValue);
      }
    } else {
      this.firstKnobValue = parseInt(calculatedValue);
    }
    this._sendDataForUpdateState();
  }

  _updateValuesWhenMove(distanceFromStart) {
    const calculatedValue = this._calculateValueForKnob(distanceFromStart);
    const firstKnobPosition = this._calculateKnobPosition(this.firstKnobValue);
    const secondKnobPosition = this._calculateKnobPosition(this.secondKnobValue);
    const { elementType } = this.selectedKnobState;

    if (this.hasIntervalSelection) {
      const valueForKnobFirstIsChangeable = (distanceFromStart <= secondKnobPosition - this.stepWidth);
      const valueForKnobSecondIsChangeable = (distanceFromStart >= firstKnobPosition + this.stepWidth);

      if (elementType === 'first' && valueForKnobFirstIsChangeable) {
        this.firstKnobValue = parseInt(calculatedValue);
      } else if (elementType === 'second' && valueForKnobSecondIsChangeable) {
        this.secondKnobValue = parseInt(calculatedValue);
      }
    } else {
      this.firstKnobValue = parseInt(calculatedValue);
    }

    this._sendDataForUpdateState();
  }

  _calculateValueForKnob(distanceFromStart) {
    const indexValueToDistanceFromStart = Math.round(this._validatePositionForKnob(distanceFromStart) / this.stepWidth);

    const isOutOfBounds =
      this._validatePositionForKnob(distanceFromStart) > (this.possibleSliderValues.length - 1)
      * this.stepWidth;

    const newKnobValue = isOutOfBounds
      ? this.maximum
      : this.possibleSliderValues[indexValueToDistanceFromStart];

    return newKnobValue;
  }

  _validatePositionForKnob(position) {
    if (position <= 0) {
      return 0;
    } else if (position >= this.scaleWidth) {
      return this.scaleWidth;
    }
    return position;
  }

  _calculateKnobPosition(value) {
    const isOffLimits =
      value > (this.possibleSliderValues[this.possibleSliderValues.length - 1]);
    // eslint-disable-next-line no-nested-ternary
    const knobPosition = isOffLimits
      ? this.scaleWidth
      : (this.possibleSliderValues.indexOf(value) < 0)
        ? this.stepWidth * this.firstKnobValue
        : this.stepWidth * (this.possibleSliderValues.indexOf(value));

    return knobPosition;
  }

  _sendDataForUpdateState() {
    const dataForUpdateState = {
      firstValue: this.firstKnobValue,
      secondValue: this.secondKnobValue,
      areTooltipsVisible: this.areTooltipsVisible,
      isVerticalOrientation: this.isVerticalOrientation,
      hasIntervalSelection: this.hasIntervalSelection,
    };

    this.notify('updateState', dataForUpdateState);
  }

  _initEventListeners() {
    this.$sliderScale.click(this._handleSliderScaleClick.bind(this));
    this.$firstKnob.mousedown(this._handleKnobMousedown.bind(this));
    this.$secondKnob.mousedown(this._handleKnobMousedown.bind(this));

    $(document).mousemove(this._handleDocumentMousemove.bind(this));
    $(document).mouseup(this._handleDocumentMouseup.bind(this));
  }

  _handleDocumentMouseup() {
    this.selectedKnobState = null;
  }

  _handleKnobMousedown(e) {
    const $currentKnob = $(e.currentTarget);
    const knobCoordinates = this._getElementCoordinates($currentKnob);

    const cursorPositionInsideKnob = this.isVerticalOrientation
      ? e.pageY - knobCoordinates.top
      : e.pageX - knobCoordinates.left;

    const elementType = $currentKnob.hasClass('js-slider__knob_first')
      ? 'first'
      : 'second';

    this.selectedKnobState = { cursorPositionInsideKnob, elementType };
  }

  _handleDocumentMousemove(e) {
    if (this.selectedKnobState !== null) {
      const { cursorPositionInsideKnob } = this.selectedKnobState;

      const distanceFromStart = this.isVerticalOrientation
        ? e.pageY - cursorPositionInsideKnob - this.sliderCoordinates.top
        : e.pageX - cursorPositionInsideKnob - this.sliderCoordinates.left;

      this._updateValuesWhenMove(distanceFromStart);
    }
  }

  _handleSliderScaleClick(e) {
    const distanceFromLeftEdgeOfScale =
      parseInt(e.pageX - this.sliderCoordinates.left - (this.$firstKnob.outerWidth() / 2));
    const distanceFromTopOfScale =
      parseInt(e.pageY - this.sliderCoordinates.top - (this.$firstKnob.outerHeight() / 2));

    const coordinatesOfClick = this.isVerticalOrientation
      ? distanceFromTopOfScale
      : distanceFromLeftEdgeOfScale;

    this._updateValuesWhenClick(coordinatesOfClick);
  }

  _setKnobPosition($currentKnob, $currentTooltip, value) {
    $currentKnob.css('left', `${this._calculateKnobPosition(value)}px`);
    $currentTooltip.html(value);
  }

  _getElementCoordinates(element) {
    const { top, left } = element.get(0).getBoundingClientRect();
    return {
      top: top + window.pageYOffset,
      left: left + window.pageXOffset,
    };
  }

  _fillScale() {
    const sliderScaleCoordinates = this.isVerticalOrientation
      ? this._getElementCoordinates(this.$sliderScale).top
      : this._getElementCoordinates(this.$sliderScale).left;

    const firstKnobCoordinates = this.isVerticalOrientation
      ? this._getElementCoordinates(this.$firstKnob).top
      : this._getElementCoordinates(this.$firstKnob).left;

    const secondKnobPosition = this.isVerticalOrientation
      ? this._getElementCoordinates(this.$secondKnob).top
      : this._getElementCoordinates(this.$secondKnob).left;

    if (this.hasIntervalSelection) {
      const firstFillLimit = (100 / this.scaleWidth) * (firstKnobCoordinates - sliderScaleCoordinates);
      const secondFillLimit = (100 / this.scaleWidth) * (secondKnobPosition - sliderScaleCoordinates);

      this.$sliderScale.css(
        'background', `linear-gradient(to right, #999 , #999 ${firstFillLimit}%, #f00 ${firstFillLimit}%, #f00 ${secondFillLimit}%, #999 ${secondFillLimit}%`,
      );
    } else {
      const fillLimit = (100 / this.scaleWidth) * (firstKnobCoordinates - sliderScaleCoordinates);

      this.$sliderScale.css(
        'background', `linear-gradient(to right, #f00, #f00 ${fillLimit}%, #999 ${fillLimit}%`,
      );
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
      this.$firstKnob.addClass('slider__knob_vertical');
      this.$firstTooltip.addClass('slider__tooltip_vertical');
      this.$secondKnob.addClass('slider__knob_vertical');
      this.$secondTooltip.addClass('slider__tooltip_vertical');
    } else {
      this.$sliderScale.removeClass('slider__element_vertical');
      this.$firstKnob.removeClass('slider__knob_vertical');
      this.$firstTooltip.removeClass('slider__tooltip_vertical');
      this.$secondKnob.removeClass('slider__knob_vertical');
      this.$secondTooltip.removeClass('slider__tooltip_vertical');
    }
  }

  _setIntervalSelection(switchedOn) {
    if (switchedOn) {
      this.$secondKnob.addClass('slider__knob_visible');
      this.$secondKnob.removeClass('slider__knob_hidden');
    } else {
      this.$secondKnob.removeClass('slider__knob_visible');
      this.$secondKnob.addClass('slider__knob_hidden');
    }
  }

  _createSliderElement() {
    const bookListingTemplate = require('./sliderTemplate.hbs');
    const $sliderElement = document.createElement('div');
    $sliderElement.className = 'slider__element js-slider__element';

    $sliderElement.innerHTML = bookListingTemplate({
      knobs: [{
        className: 'slider__knob slider__knob_first js-slider__knob_first',
        tooltip: [{
          className: 'slider__tooltip slider__tooltip_first js-slider__tooltip_first',
        }],
      }, {
        className: 'slider__knob slider__knob_second js-slider__knob_second',
        tooltip: [{
          className: 'slider__tooltip slider__tooltip_second js-slider__tooltip_second',
        }],
      }],
    });

    this.$slider.append($sliderElement);
  }
}

export default ViewSlider;
