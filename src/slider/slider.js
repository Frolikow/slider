
'use strict';

$(document).ready(function () {
  $('.block_slider').each(function () {
    $(this).efSlider({
      sliderConfigPanel: true,
      sliderMin: 50,
      sliderMax: 100,
      sliderValue: 75,
      sliderValueRange: 85,
      sliderStep: 1,
      sliderHandleValue: false,
      verticalOrientation: false,
      sliderRangeStatus: true
    });
  });
});
