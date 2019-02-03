import $ from 'jquery';

$(document).ready(() => {
  $('.slider').each(function () {
    $(this).efSlider({
      isConfigPanelVisible: true,
      firstValue: 2,
      secondValue: 8,
      minimum: 1,
      maximum: 10,
      step: 1,
      areTooltipsVisible: true,
      isVerticalOrientation: false,
      hasIntervalSelection: true,
    });
  });
});
