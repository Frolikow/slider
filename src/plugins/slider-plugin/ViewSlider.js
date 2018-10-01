import EventEmitter from './eventEmiter';

class ViewSlider extends EventEmitter {
  constructor(options, thisForViewSlider) {
    super();
    this.createSlider(thisForViewSlider);
    // this.notify();
  }

  someMethod() {
    console.log('call someMethod(ViewSlider) complete');
  }
  someMethod3() {
    console.log('call someMethod3(ViewSlider) complete');
  }

  createSlider(thisForViewSlider) {
    thisForViewSlider.html(`<div class='slider__element'>
        <div class='slider__handle slider__handle_left'> <div class='slider__value slider__value_left'></div></div>
        <div class='slider__handle slider__handle_right'> <div class='slider__value slider__value_right'>`);

    const scale = thisForViewSlider.find('.slider__element');
    const handleFirst = thisForViewSlider.find('.slider__handle_left');
    const valueFirst = thisForViewSlider.find('.slider__value_left');
    const handleSecond = thisForViewSlider.find('.slider__handle_right');
    const valueSecond = thisForViewSlider.find('.slider__value_right');
  }
}

export default ViewSlider;
