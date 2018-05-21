
'use strict';

$(document).ready(function () {
  $('.block_slider').slider();
});

(function ($) {
  jQuery.fn.slider = function () {
    //создание элементов слайдера
    $('.block_slider').html('<div class="slider">');
    $('.slider').html('<div class="slider_handle">');
    $('.slider_handle').html('<div class="slider_handle_value">');

    let sliderMin = 1;
    let sliderMax = 5;
    let sliderValue = 2;
    let sliderStep = 3;
    let verticalOrientation = false;

    //присваивание переменных соответствующим элементам
    let sliderElem = $('.slider:eq(0)');
    let handleElem = $('.slider_handle:eq(0)');
    let valueElem = $('.slider_handle_value:eq(0)');


    handleElem.css('left', defaultValue(sliderMax, sliderMin, sliderValue));

    handleElem.mousedown(function (event) { //событие нажатой ЛКМ
      let sliderCoords = getCoords(sliderElem); //внутренние координаты слайдера
      let handleCoords = getCoords(handleElem); //внутренние координаты ползунка
      let shift; //координаты левого края элемента
      if (verticalOrientation == true) {
        shift = event.pageY - handleCoords.top;
      } else {
        shift = event.pageX - handleCoords.left;
      }


      // движение нажатой ЛКМ
      $(document).on('mousemove', function (event) {
        //вычисление левого края слайдера и задание координат для ползунка
        let beginEdge;
        let endEdge;
        // debugger;
        let position = [];
        let currentValue = 0;
        let slMin = sliderMin;
        let slMax = sliderMax;
        for (var i = 0; currentValue < slMax; i++) {
          if (slMin >= slMax) {
            currentValue = slMax;
            position.push(currentValue);
          }
          else {
            currentValue = slMin;
            slMin += sliderStep;
            position.push(currentValue);
          }
        }
        console.log('position ' + position);

        if (verticalOrientation) {
          beginEdge = (event.pageY - shift - sliderCoords.top)/sliderStep;
          if (beginEdge < 0) {
            beginEdge = 0;
          }
          endEdge = sliderElem.outerWidth() - handleElem.outerWidth();
          if (beginEdge > endEdge) {
            beginEdge = endEdge;
          }
          handleElem.css('left', searchPosition(beginEdge, endEdge) + 'px');
        }
        else {
          beginEdge = (event.pageX - shift - sliderCoords.left)/sliderStep;
          if (beginEdge < 0) {
            beginEdge = 0;
          }
          endEdge = sliderElem.outerWidth() - handleElem.outerWidth();
          if (beginEdge > endEdge) {
            beginEdge = endEdge;
          }

          handleElem.css('left', searchPosition(beginEdge, endEdge) + 'px');
        }

        function searchPosition(begin, end) {
          let widthOfstep = (end / (position.length - 1));
          let currentIndex = $.inArray(sliderValue, position);
          let halfWidthOfStep = widthOfstep / 2;
          let currentPositionHandle = widthOfstep * currentIndex;

          let testValue = (currentPositionHandle + halfWidthOfStep) * sliderStep;
          console.log('begin ' + begin);
          console.log('end ' + end);
          console.log('widthOfstep ' + widthOfstep);
          console.log('currentIndex ' + currentIndex);
          console.log('halfWidthOfStep ' + halfWidthOfStep);
          console.log('currentPositionHandle ' + currentPositionHandle);
          console.log('testValue ' + testValue);
          console.log(' ');

          if (begin < testValue) {
            currentPositionHandle = widthOfstep * currentIndex;
            return currentPositionHandle;
          }
          else if (begin > testValue) {
            currentPositionHandle = widthOfstep * (currentIndex + 1);
            return currentPositionHandle;
          }
          return currentPositionHandle;
        }

        calculateSliderValue(sliderMax, sliderMin, beginEdge);
      });

      $(document).mouseup(function () {  //событие ОТжатой ЛКМ, отмена "mousemove"
        $(document).off('mousemove');
      });
    });

    sliderElem.click(function (event) { //обработка клика ЛКМ по шкале слайдера
      let sliderCoords = getCoords(sliderElem); //внутренние координаты слайдера
      let shift;
      if (verticalOrientation) {
        shift = event.pageY - sliderCoords.top - (handleElem.outerHeight() / 2);
      } else {
        shift = event.pageX - sliderCoords.left - (handleElem.outerWidth() / 2);
      }
      handleElem.animate({ left: shift + 'px' }, 300, calculateSliderValue(sliderMax, sliderMin, shift))
    })

    function calculateSliderValue(slMax, slMin, beginEdge) { //расчет значения над ползунком
      let sliderWidth = parseInt(sliderElem.css('width'));
      let sliderValueStep = (sliderWidth / (slMax - slMin)) * 0.96;
      let currentSliderValue = ((beginEdge + (sliderValueStep / 2)) / sliderValueStep) ^ 0;

      let values = [];
      let currentValue = 0;
      for (var i = 0; currentValue < slMax; i++) {
        currentValue = slMin;
        slMin += sliderStep;
        values.push(currentValue);
      }
      $('.config_currentValue:eq(0)').val(values[currentSliderValue]);
      valueElem.html(values[currentSliderValue]);
      sliderValue = values[currentSliderValue];
    }

    function defaultValue(slMax, slMin, slVal) {  //установка ползунка в позицию "по-умолчанию" = sliderValue
      let defaultPosition = (parseInt(sliderElem.css('width')) / (slMax - slMin)) * 0.96;
      let sliderMin = slMin;
      let values = [];
      let currentValue = 0;
      for (var i = 0; currentValue < slMax; i++) {
        currentValue = sliderMin;
        sliderMin++;
        values.push(currentValue);
      }
      if (slVal < slMin) {
        slVal = slMin;
      }
      else if (slVal > slMax) {
        slVal = slMax;
      }
      valueElem.html(slVal);
      defaultPosition = $.inArray(slVal, values) * defaultPosition;
      return defaultPosition;
    }

    function getCoords(elem) { //получение координат курсора внутри элемента
      let box = elem.get(0).getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };
    }

    //создание элементов для панели конфигов
    $('.block_config').html('<div class="config_panel">')
    $('.config_panel').html('<label><input type="checkbox" class="config_showHandleValue">Убрать флажок</label>'
      + '<label><input type="checkbox" class="config_orientation">Включить вертикальное отображение</label>'
      + '<label><input type="checkbox" class="config_range">Включить выбор интервала</label>'
      + '<label>Текущее значение</label><input type="number" class="config_currentValue">'
      + '<label>Минимальное значение слайдера</label><input type="number" class="config_minValue">'
      + '<label>Максимальное значение слайдера</label><input type="number" class="config_maxValue">'
      + '<label>Размер шага слайдера</label><input type="number" class="config_sizeOfStep">');


    $('.config_showHandleValue:eq(0)').change(function () {  //убрать флажок
      if (this.checked) {
        $('.slider_handle_value').css('display', 'none')
      }
      else {
        $('.slider_handle_value').css('display', 'block')
      }
    }) //complete

    $('.config_orientation:eq(0)').change(function () {  //вкл/выкл вертикальной ориентации
      if (this.checked) {
        $('.block_slider:eq(0)').addClass('verticalBlockSlider');
        $('.slider:eq(0)').addClass('verticalSlider');
        $('.slider_handle:eq(0)').addClass('verticalSlider_handle');
        $('.slider_handle_value:eq(0)').addClass('verticalSlider_handle_value');
        verticalOrientation = true;
      }
      else {
        $('.block_slider:eq(0)').removeClass('verticalBlockSlider');
        $('.slider:eq(0)').removeClass('verticalSlider');
        $('.slider_handle:eq(0)').removeClass('verticalSlider_handle');
        $('.slider_handle_value:eq(0)').removeClass('verticalSlider_handle_value');
        verticalOrientation = false;
      }
    }) //complete




    // test();    // function test(){    //   $('.config_range:eq(0)').click();    // }
    $('.config_range:eq(0)').change(function () {  //вкл/выкл выбор диапазона
      if (this.checked) {
        console.log('config_range checked');
        $('.slider_handle_value:eq(0)').addClass('handle_left');
        $('.slider_handle_value:eq(0)').after('<div class="slider_handle_value handle_right"><div/>');
      }
      else {
        console.log('config_range unchecked');
        $('.slider_handle_value:eq(0)').removeClass('handle_left');
        $('.handle_right:eq(0)').remove();
      }
    })




    $('.config_currentValue:eq(0)').val(sliderValue);
    $('.config_currentValue:eq(0)').focusout(function () { //текущее значение слайдера
      valueElem.html(this.value);
      handleElem.css('left', defaultValue(sliderMax, sliderMin, parseInt(this.value)));
    })//complete

    $('.config_minValue:eq(0)').val(sliderMin);
    $('.config_minValue:eq(0)').focusout(function () { //минимальное значение слайдера
      sliderMin = parseInt(this.value);
      handleElem.css('left', defaultValue(sliderMax, sliderMin, sliderValue));
    }) //complete


    $('.config_maxValue:eq(0)').val(sliderMax);
    $('.config_maxValue:eq(0)').focusout(function () { //максимальное значение слайдера
      sliderMax = parseInt(this.value);
      handleElem.css('left', defaultValue(sliderMax, sliderMin, sliderValue));
    }) //complete


    $('.config_sizeOfStep:eq(0)').val(sliderStep);
    $('.config_sizeOfStep:eq(0)').focusout(function () { //размера шага слайдера
      sliderStep = parseInt(this.value);
    })
  }
})(jQuery);
