import $ from 'jquery';
import EventEmitter from '../eventEmiter/eventEmiter';

class ViewSlider extends EventEmitter {
  constructor($sliderElement) {
    super();
    super.addEmitter(this.constructor.name);

    this.$slider = $sliderElement;
  }

  initSlider() {
    this._createSliderElement();
    this.$sliderScale = this.$slider.find('.js-slider__element');
    this.$firstHandle = this.$slider.find('.js-slider__handle_first');
    this.$firstTooltip = this.$slider.find('.js-slider__tooltip_first');
    this.$secondHandle = this.$slider.find('.js-slider__handle_second');
    this.$secondTooltip = this.$slider.find('.js-slider__tooltip_second');

    this.scaleWidth = this.$sliderScale.outerWidth() - this.$firstHandle.outerWidth();

    this.notify('calculateIndexOfRelativeCoordinates', this.scaleWidth);
    this._initEventListeners();
  }

  updateSlider(dataForUpdate) {
    const { value, valueRange, firstHandleCoordinates, secondHandleCoordinates, hasIntervalSelection, isVerticalOrientation, areTooltipsVisible } = dataForUpdate;
    this.isVerticalOrientation = isVerticalOrientation;
    this.hasIntervalSelection = hasIntervalSelection;

    this._setTooltipsVisibility(areTooltipsVisible);
    this._setOrientation(isVerticalOrientation);
    this._setIntervalSelection(hasIntervalSelection);

    this._setFirstHandlePosition(value, firstHandleCoordinates);
    if (hasIntervalSelection) {
      this._setSecondHandlePosition(valueRange, secondHandleCoordinates);
    }
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

    const dataForPositionSearch = { coordinates: coordinatesOfClickInSlider, elementType, hasIntervalSelection: this.hasIntervalSelection };
    this.notify('sendCoordinatesWhenMoving', dataForPositionSearch);
  }

  _handleSliderScaleClick(e) {
    const sliderCoordinates = this._getCoordinatesOfElementInsideWindow(this.$sliderScale);
    const coordinatesOfClick = this.isVerticalOrientation ? parseInt(e.pageY - sliderCoordinates.top - (this.$firstHandle.outerHeight() / 2)) : parseInt(e.pageX - sliderCoordinates.left - (this.$firstHandle.outerWidth() / 2));

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
