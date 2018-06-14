
'use strict';

$(document).ready(function () {
  $('.block_slider').each(function () {
    $(this).efSlider({
      sliderConfigPanel: true,
      sliderMin: 10,
      sliderMax: 20,
      sliderValue: 14,
      sliderValueRange: 18,
      sliderStep: 1,
      sliderHandleValueHide: false,
      verticalOrientation: false,
      sliderRangeStatus: true
    });
  });
});
