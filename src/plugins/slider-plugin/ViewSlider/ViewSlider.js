import $ from 'jquery';
import EventEmitter from '../eventEmiter/eventEmiter';

class ViewSlider extends EventEmitter {
  constructor(viewOptions) {
    super();
    super.addEmitter(this.constructor.name);

    this.$slider = viewOptions.$slider;
  }
  initSlider() {
    this._createSliderElement();
    this.$sliderScale = this.$slider.find('.slider__element');
    this.$firstHandle = this.$slider.find('.slider__handle_left');
    this.$firstTooltip = this.$slider.find('.slider__value_left');
    this.$secondHandle = this.$slider.find('.slider__handle_right');
    this.$secondTooltip = this.$slider.find('.slider__value_right');

    this.scaleWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();
    this.notify('calculateIndexOfRelativeCoordinates', this.scaleWidth);
    this._createEventHandlers();
  }
  updateSlider(dataForUpdate) {
    // sliderData = { value, valueRange, firstPosition, secondPosition, isIntervalSelection, isVerticalOrientation, isVisibilityTooltips };
    this.sliderData = { ...dataForUpdate };

    this.sliderData.isVisibilityTooltips ? this._changeVisibilityTooltips(true) : this._changeVisibilityTooltips(false);
    this.sliderData.isVerticalOrientation ? this._changeOrientation(true) : this._changeOrientation(false);
    this.sliderData.isIntervalSelection ? this._changeIntervalSelection(true) : this._changeIntervalSelection(false);

    const dataForSetHandlePosition = {
      value: this.sliderData.value,
      valueRange: this.sliderData.valueRange,
      coordinatesFirstHandle: this.sliderData.coordinatesFirstHandle,
      coordinatesSecondHandle: this.sliderData.coordinatesSecondHandle,
      elementType: 'first',
    };

    this._setHandlePosition(dataForSetHandlePosition);
    if (this.sliderData.isIntervalSelection) {
      dataForSetHandlePosition.elementType = 'second';
      this._setHandlePosition(dataForSetHandlePosition);
    }
  }

  _createEventHandlers() {
    this.$sliderScale.click(this._handleSliderScaleClick.bind(this));
    this.$firstHandle.mousedown(this._handleMouseDownOnHandle.bind(this, this.$firstHandle));
    this.$secondHandle.mousedown(this._handleMouseDownOnHandle.bind(this, this.$secondHandle));
  }

  _handleMouseDownOnHandle($currentHandle) {
    const sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);
    const handleCoordinates = this._getCoordinatesOfElementInsideWindow($currentHandle);

    let cursorPositionInsideHandle;
    if (this.isVerticalOrientation === true) {
      cursorPositionInsideHandle = event.pageY - handleCoordinates.top;
    } else {
      cursorPositionInsideHandle = event.pageX - handleCoordinates.left;
    }
    $(document).mousemove(this._handleMouseMoveOnHandle.bind(this, $currentHandle, sliderCoordinates, cursorPositionInsideHandle));
    $(document).mouseup(() => { $(document).off('mousemove'); });
  }
  _handleMouseMoveOnHandle($currentHandle, sliderCoordinates, cursorPositionInsideHandle) {
    let coordinatesOfClickInSlider;
    if (this.isVerticalOrientation) {
      coordinatesOfClickInSlider = event.pageY - cursorPositionInsideHandle - sliderCoordinates.top;
    } else {
      coordinatesOfClickInSlider = event.pageX - cursorPositionInsideHandle - sliderCoordinates.left;
    }
    let elementType;
    if ($currentHandle === this.$firstHandle) {
      elementType = 'first';
    } else if ($currentHandle === this.$secondHandle) {
      elementType = 'second';
    }
    const dataForPositionSearch = { coordinates: coordinatesOfClickInSlider, elementType, isIntervalSelection: this.sliderData.isIntervalSelection };
    this.notify('sendCoordinatesWhenMoving', dataForPositionSearch);
  }

  _handleSliderScaleClick() {
    let coordinatesOfClick;
    const sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);
    if (this.isVerticalOrientation) {
      coordinatesOfClick = parseInt(event.pageY - sliderCoordinates.top - (this.$firstHandle.outerHeight() / 2));
    } else {
      coordinatesOfClick = parseInt(event.pageX - sliderCoordinates.left - (this.$firstHandle.outerWidth() / 2));
    }
    this.notify('sendCoordinatesWhenClick', coordinatesOfClick);
  }

  _setHandlePosition(dataForSetHandlePosition) {
    // dataForSetHandlePosition = { value, valueRange, coordinatesFirstHandle, coordinatesSecondHandle, elementType }
    const { value, valueRange, coordinatesFirstHandle, coordinatesSecondHandle, elementType } = dataForSetHandlePosition;
    if (elementType === 'first') {
      this._setFirstSliderPosition(value, coordinatesFirstHandle);
    }
    if (elementType === 'second') {
      this._setSecondSliderPosition(valueRange, coordinatesSecondHandle);
    }
  }
  _setFirstSliderPosition(value, coordinates) {
    this.$firstHandle.css('left', `${coordinates}px`);
    this.$firstTooltip.html(value);
  }
  _setSecondSliderPosition(value, coordinates) {
    this.$secondHandle.css('left', `${coordinates}px`);
    this.$secondTooltip.html(value);
  }
  _getCoordinatesOfElementInsideWindow(element) {
    const box = element.get(0).getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }
  _changeVisibilityTooltips(switchedOn) {
    if (switchedOn) {
      this.$firstTooltip.removeClass('slider__value_hidden');
      this.$secondTooltip.removeClass('slider__value_hidden');
      this.$firstTooltip.addClass('slider__value_visible');
      this.$secondTooltip.addClass('slider__value_visible');
    } else {
      this.$firstTooltip.removeClass('slider__value_visible');
      this.$secondTooltip.removeClass('slider__value_visible');
      this.$firstTooltip.addClass('slider__value_hidden');
      this.$secondTooltip.addClass('slider__value_hidden');
    }
  }
  _changeOrientation(switchedOn) {
    if (switchedOn) {
      this.$sliderScale.addClass('slider__element_vertical');
      this.$firstHandle.addClass('slider__handle_vertical');
      this.$firstTooltip.addClass('slider__value_vertical');
      this.$secondHandle.addClass('slider__handle_vertical');
      this.$secondTooltip.addClass('slider__value_vertical');
    } else {
      this.$sliderScale.removeClass('slider__element_vertical');
      this.$firstHandle.removeClass('slider__handle_vertical');
      this.$firstTooltip.removeClass('slider__value_vertical');
      this.$secondHandle.removeClass('slider__handle_vertical');
      this.$secondTooltip.removeClass('slider__value_vertical');
    }
  }
  _changeIntervalSelection(switchedOn) {
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
    const sliderElement = document.createElement('div');
    sliderElement.className = 'slider__element';

    sliderElement.innerHTML = bookListingTemplate({
      handles: [{
        className: 'slider__handle slider__handle_left',
        tooltip: [{
          className: 'slider__value slider__value_left',
        }],
      }, {
        className: 'slider__handle slider__handle_right',
        tooltip: [{
          className: 'slider__value slider__value_right',
        }],
      }],
    });
    this.$slider.append(sliderElement);
  }
}

export default ViewSlider;
