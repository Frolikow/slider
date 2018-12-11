import $ from 'jquery';
import EventEmitter from '../eventEmiter/eventEmiter';

class ViewSlider extends EventEmitter {
  constructor(sliderElement) {
    super();
    super.addEmitter(this.constructor.name);

    this.$slider = sliderElement;
  }

  initSlider() {
    this._createSliderElement();
    this.$sliderScale = this.$slider.find('.slider__element');
    this.$firstHandle = this.$slider.find('.slider__handle_first');
    this.$firstTooltip = this.$slider.find('.slider__tooltip_first');
    this.$secondHandle = this.$slider.find('.slider__handle_second');
    this.$secondTooltip = this.$slider.find('.slider__tooltip_second');

    this.scaleWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();

    this.notify('calculateIndexOfRelativeCoordinates', this.scaleWidth);
    this._initEventListeners();
  }

  updateSlider(dataForUpdate) {
    const { value, valueRange, coordinatesFirstHandle, coordinatesSecondHandle, isIntervalSelection, isVerticalOrientation, isVisibilityTooltips } = dataForUpdate;
    this.isVerticalOrientation = isVerticalOrientation;
    this.isIntervalSelection = isIntervalSelection;

    this._setVisibilityTooltips(isVisibilityTooltips);
    this._setOrientation(isVerticalOrientation);
    this._setIntervalSelection(isIntervalSelection);

    if (isIntervalSelection) {
      this._setFirstHandlePosition(value, coordinatesFirstHandle);
      this._setSecondHandlePosition(valueRange, coordinatesSecondHandle);
    }
  }

  _initEventListeners() {
    this.$sliderScale.click(this._handleSliderScaleClick.bind(this));
    this.$firstHandle.mousedown(this._handleHandleMouseDown.bind(this));
    this.$secondHandle.mousedown(this._handleHandleMouseDown.bind(this));
  }

  _handleHandleMouseDown() {
    const sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);
    const handleCoordinates = this._getCoordinatesOfElementInsideWindow($(event.currentTarget));

    let cursorPositionInsideHandle;
    if (this.isVerticalOrientation === true) {
      cursorPositionInsideHandle = event.pageY - handleCoordinates.top;
    } else {
      cursorPositionInsideHandle = event.pageX - handleCoordinates.left;
    }

    $(document).mousemove(this._handleHandleMouseMove.bind(this, $(event.currentTarget), sliderCoordinates, cursorPositionInsideHandle));
    $(document).mouseup(() => { $(document).off('mousemove'); });
  }

  _handleHandleMouseMove($currentHandle, sliderCoordinates, cursorPositionInsideHandle) {
    let coordinatesOfClickInSlider;
    if (this.isVerticalOrientation) {
      coordinatesOfClickInSlider = event.pageY - cursorPositionInsideHandle - sliderCoordinates.top;
    } else {
      coordinatesOfClickInSlider = event.pageX - cursorPositionInsideHandle - sliderCoordinates.left;
    }

    let elementType;
    if ($($currentHandle).hasClass('slider__handle_first')) {
      elementType = 'first';
    } else if ($($currentHandle).hasClass('slider__handle_second')) {
      elementType = 'second';
    }

    const dataForPositionSearch = { coordinates: coordinatesOfClickInSlider, elementType, isIntervalSelection: this.isIntervalSelection };
    this.notify('sendCoordinatesWhenMoving', dataForPositionSearch);
  }

  _handleSliderScaleClick() {
    const sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);

    let coordinatesOfClick;
    if (this.isVerticalOrientation) {
      coordinatesOfClick = parseInt(event.pageY - sliderCoordinates.top - (this.$firstHandle.outerHeight() / 2));
    } else {
      coordinatesOfClick = parseInt(event.pageX - sliderCoordinates.left - (this.$firstHandle.outerWidth() / 2));
    }

    this.notify('sendCoordinatesWhenClick', coordinatesOfClick);
  }

  _setFirstHandlePosition(value, coordinates) {
    this.$firstHandle.css('left', `${coordinates}px`);
    this.$firstTooltip.html(value);
  }

  _setSecondHandlePosition(value, coordinates) {
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

  _setVisibilityTooltips(switchedOn) {
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
    const sliderElement = document.createElement('div');
    sliderElement.className = 'slider__element';

    sliderElement.innerHTML = bookListingTemplate({
      handles: [{
        className: 'slider__handle slider__handle_first',
        tooltip: [{
          className: 'slider__tooltip slider__tooltip_first',
        }],
      }, {
        className: 'slider__handle slider__handle_second',
        tooltip: [{
          className: 'slider__tooltip slider__tooltip_second',
        }],
      }],
    });

    this.$slider.append(sliderElement);
  }
}

export default ViewSlider;
