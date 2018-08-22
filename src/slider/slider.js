import $ from 'jquery';

$(document).ready(() => {
  $('.block_slider').each(function () {
    $(this).efSlider({
      sliderConfigPanel: true,
      sliderMin: 1,
      sliderMax: 10,
      sliderValue: 5,
      sliderValueRange: 8,
      sliderStep: 1,
      sliderHandleValueHide: false,
      verticalOrientation: false,
      sliderRangeStatus: false,
    });
  });
});
