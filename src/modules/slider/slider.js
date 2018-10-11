import $ from 'jquery';

$(document).ready(() => {
  $('.slider').each(function () {
    $(this).efSlider({
      slider: $(this),
      showConfigPanel: true,
      minimum: 2,
      maximum: 10,
      value: undefined,
      valueRange: 8,
      step: 1,
      handleValueHide: false,
      verticalOrientation: false,
      rangeStatus: true,
    });
  });
});
