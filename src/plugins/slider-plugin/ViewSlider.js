class ViewSlider {
  constructor(thisForViewSlider) {
    this.createSlider(thisForViewSlider);
  }

  createSlider(thisForViewSlider) {
    thisForViewSlider.html('<div class="slider__element">'
      + ' <div class="slider__handle slider__handle_left"> <div class="slider__value slider__value_left"></div></div>'
      + '<div class="slider__handle slider__handle_right"> <div class="slider__value slider__value_right">');
  }
}

export default ViewSlider;
