
'use strict';

$(document).ready(function () {
  $('.block_slider').slider();
});

(function ($) {
  jQuery.fn.slider = function () {
    //создание элементов слайдера
    $('.block_slider').html('<div class="slider">');
    $('.slider').html('<div class="slider_handle" id="test">');
    $('.slider_handle').html('<div class="slider_handle_value">');

    let sliderMin = 0;
    let sliderMax = 10;
    let sliderValue = 5;

    //присваивание переменных соответствующим элементам
    let sliderElem = $('.slider:eq(0)');
    let handleElem = $('.slider_handle:eq(0)');
    let valueElem = $('.slider_handle_value:eq(0)');

    valueElem.html(sliderValue);
    handleElem.css('left', defaultValue());

    //событие нажатой ЛКМ
    handleElem.mousedown(function (event) {
      let sliderCoords = getCoords(sliderElem); //внутренние координаты слайдера
      let handleCoords = getCoords(handleElem); //внутренние координаты ползунка
      let shiftX = event.pageX - handleCoords.left; //координаты левого края элемента

      // движение нажатой ЛКМ
      $(document).on('mousemove', function (event) {
        //вычисление левого края слайдера и задание координат для ползунка
        let newLeft = event.pageX - shiftX - sliderCoords.left;
        if (newLeft < 0) {
          newLeft = 0;
        }
        let rightEdge = sliderElem.outerWidth() - handleElem.outerWidth();
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }
        handleElem.css('left', newLeft + 'px');

        calculateSliderValue(sliderMax, sliderMin, newLeft);
      });

      $(document).mouseup(function () {  //событие ОТжатой ЛКМ, отмена "mousemove"
        $(document).off('mousemove');
      });
    });

    function calculateSliderValue(slMax, slMin, leftEdge) { //расчет значения над ползунком
      let sliderWidth = parseInt(sliderElem.css('width'));
      let sliderStep = (sliderWidth / slMax - slMin)*0.96;
      let currentSliderValue = leftEdge / sliderStep;
      valueElem.html(currentSliderValue ^ 0);
    }

    function defaultValue(){  //установка ползунка в позицию "по-умолчанию" = sliderValue
      let defaultPosition = sliderValue*((parseInt(sliderElem.css('width')) /sliderMax - sliderMin)*0.96);
      return defaultPosition;
    }

    function getCoords(elem) { //получение координат курсора внутри элемента
      let box = elem.get(0).getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };
    }

  }
})(jQuery);
