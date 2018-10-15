import $ from 'jquery';

$(document).ready(() => {
  $('.slider').each(function () {
    $(this).efSlider({
      slider: $(this),
      visibilityConfigPanel: true,
      minimum: 1,
      maximum: 10,
      value: 2,
      valueRange: 8,
      step: 1,
      visibilityTooltips: true,
      verticalOrientation: false,
      rangeStatus: true,
    });
  });
});
