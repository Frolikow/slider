import $ from 'jquery';

$(document).ready(() => {
  $('.block_slider').each(function () {
    $(this).efSlider({
      sliderConfigPanel: true,
      sliderMin: 1,
      sliderMax: 5,
      sliderValue: 2,
      sliderValueRange: 3,
      sliderStep: 1,
      sliderHandleValueHide: false,
      verticalOrientation: false,
      sliderRangeStatus: false,
    });
  });
});
