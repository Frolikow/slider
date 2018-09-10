import $ from 'jquery';

$(document).ready(() => {
  $('.slider').each(function () {
    $(this).efSlider({
      sliderConfigPanel: true,
      sliderMin: 10,
      sliderMax: 100,
      sliderValue: 50,
      sliderValueRange: 80,
      sliderStep: 1,
      sliderHandleValueHide: false,
      verticalOrientation: false,
      sliderRangeStatus: false,
    });
  });
});
