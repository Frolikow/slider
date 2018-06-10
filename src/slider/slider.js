
'use strict';

$(document).ready(function () {
  $('.block_slider:eq(0)').efSlider({
    sliderMin: 50,
    sliderMax: 100,
    sliderValue: 75,
    sliderValueRange: 85,
    sliderStep: 5,
    sliderHandleValue: false,
    verticalOrientation: true,
    sliderRangeStatus: false
  });
});
