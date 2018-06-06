
'use strict';

$(document).ready(function () {
  $('.block_slider:eq(0)').efSlider(
    {
      sliderMin: 5,
      sliderMax: 200,
      sliderValue: 25,
      sliderValueRange: 70,
      sliderStep: 10,
      verticalOrientation: true,
      sliderRangeStatus: true
    }
  );
});
