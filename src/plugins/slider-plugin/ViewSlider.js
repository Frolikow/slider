import $ from 'jquery';
import EventEmitter from './eventEmiter';

class ViewSlider extends EventEmitter {
  constructor(options) {
    super();
    this.initSlider(options);
  }

  initSlider(options) {
    this.slider = $(options.slider);
    this.slider.html(`<div class='slider__element'>
    <div class='slider__handle slider__handle_left'> <div class='slider__value slider__value_left'></div></div>
    `);
    // <div class='slider__handle slider__handle_right'> <div class='slider__value slider__value_right'>

    this.scale = this.slider.find('.slider__element');
    this.handleFirst = this.slider.find('.slider__handle_left');
    this.valueFirst = this.slider.find('.slider__value_left');
    this.handleSecond = this.slider.find('.slider__handle_right');
    this.valueSecond = this.slider.find('.slider__value_right');

    this.valueFirst.text(options.value); // тестовое оторбражение числа(возможно далее будет отображаться значение прилетевшее из конфиг панели)

    options.handleValueHide ? this.someMethod1(true) : this.someMethod1(false);

    // oriental.attr({ checked: this.verticalOrientationConfigPanel ? 'checked' : null });
    // range.attr({ checked: this.rangeStatusConfigPanel ? 'checked' : null });
  }
  someMethod1(value) {
    if (value) {
      this.valueFirst.removeClass('slider__value_visible');
      this.valueSecond.removeClass('slider__value_visible');
      this.valueFirst.addClass('slider__value_hidden');
      this.valueSecond.addClass('slider__value_hidden');
    } else {
      this.valueFirst.removeClass('slider__value_hidden');
      this.valueSecond.removeClass('slider__value_hidden');
      this.valueFirst.addClass('slider__value_visible');
      this.valueSecond.addClass('slider__value_visible');
    }
  }
}

export default ViewSlider;
