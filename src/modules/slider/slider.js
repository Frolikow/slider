import $ from 'jquery';

$(document).ready(() => {
  $('.slider').each(function () {
    $(this).efSlider({
      showConfigPanel: true,
      minimum: 1,
      maximum: 10,
      value: 5,
      valueRange: 8,
      step: 1,
      handleValueHide: false,
      verticalOrientation: false,
      rangeStatus: false,
    });
  });
});
