
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
    let sliderMax = 10;
    let sliderValue = 3;
    let sliderStep = 2;
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
        let beginEdge;
        let endEdge;
        let position = [];
        let currentValue = 0;
        let slMin = sliderMin;
        let slMax = sliderMax;
        for (var i = 0; currentValue < slMax; i++) {
          if (slMin > slMax) {
            break;
          }
          else {
            currentValue = slMin;
            slMin += sliderStep;
            position.push(currentValue);
          }
        }

        if (verticalOrientation) {
          beginEdge = (event.pageY - shift - sliderCoords.top) / sliderStep;
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
          beginEdge = (event.pageX - shift - sliderCoords.left) / sliderStep;
          if (beginEdge < 0) {
            beginEdge = 0;
          }
          endEdge = sliderElem.outerWidth() - handleElem.outerWidth();
          if (beginEdge > endEdge) {
            beginEdge = endEdge;
          }

          handleElem.css('left', searchPosition(beginEdge ^ 0, endEdge) + 'px');
        }

        function searchPosition(begin, end) {
          let widthOfstep = (end / (position.length - 1));
          let currentIndex = $.inArray(sliderValue, position);
          let halfWidthOfStep = (widthOfstep / 2);
          let currentPositionHandle = widthOfstep * currentIndex;

          let currentPositionCursor = begin * sliderStep;
          let middleOfPosition = currentPositionHandle + halfWidthOfStep;

          if (currentPositionCursor >= (widthOfstep * (position.length - 1)) || currentIndex == -1) {
            currentPositionHandle = end;
          }
          else {
            if (currentPositionCursor <= middleOfPosition) {
              currentPositionHandle = widthOfstep * currentIndex;
            }
            else if (currentPositionCursor > middleOfPosition) {
              currentIndex = widthOfstep * currentIndex + widthOfstep;
            }
          }
          return currentPositionHandle;
        }

        calculateSliderValue(sliderMax, sliderMin, beginEdge);
      });

      $(document).mouseup(function () {  //событие ОТжатой ЛКМ, отмена "mousemove"
        $(document).off('mousemove');
      });
    });

    sliderElem.click(function () { //обработка клика ЛКМ по шкале слайдера
      let clickPositionArray = [];
      let clickPositionValue = 0;
      let slMin = sliderMin;
      let slMax = sliderMax;
      for (var i = 0; clickPositionValue < slMax; i++) {
        if (slMin > slMax) {
          break;
        }
        else {
          clickPositionValue = slMin;
          slMin += sliderStep;
          clickPositionArray.push(clickPositionValue);
        }
      }

      let shift;
      let sliderCoords = getCoords(sliderElem); //внутренние координаты слайдера
      if (verticalOrientation) {
        shift = event.pageY - sliderCoords.top - (handleElem.outerHeight() / 2);
      } else {
        shift = event.pageX - sliderCoords.left - (handleElem.outerWidth() / 2);
      }
      // debugger;
      let sliderWidth = parseInt(sliderElem.css('width')) - 20;
      let clickSliderValueStep = sliderWidth / ((clickPositionArray[clickPositionArray.length - 1] - clickPositionArray[0]) / sliderStep);
      let currentIndex = $.inArray(sliderValue, clickPositionArray);

      let test;
      let currentSliderValue = ((shift + (clickSliderValueStep / 2)) / clickSliderValueStep) ^ 0;
      let clickMiddlePosition = parseInt((clickSliderValueStep * currentSliderValue) + (clickSliderValueStep / 2));
      if (shift < clickMiddlePosition) {
        test = clickSliderValueStep * currentSliderValue;
      }
      else if (shift > clickMiddlePosition) {
        test = clickSliderValueStep * currentSliderValue + clickSliderValueStep;
      }

      handleElem.animate({ left: test + 'px' }, 300, calculateSliderValue(sliderMax, sliderMin, shift / sliderStep));
    })

    function calculateSliderValue(slMax, slMin, beginEdge) { //расчет значения над ползунком
      let sliderWidth = parseInt(sliderElem.css('width')) - 20;

      let values = [];
      let currentValue = 0;
      for (var i = 0; currentValue < slMax; i++) {
        if (slMin > slMax) {
          break;
        }
        else {
          currentValue = slMin;
          slMin += sliderStep;
          values.push(currentValue);
        }
      }
      let sliderValueStep = sliderWidth / (values[values.length - 1] - values[0]);
      let currentSliderValue = ((beginEdge + (sliderValueStep / 2)) / sliderValueStep) ^ 0;
      
      valueElem.html(values[currentSliderValue]);
      sliderValue = parseInt(valueElem.text());
      $('.config_currentValue:eq(0)').val(sliderValue);
    }

    function defaultValue(slMax, slMin, slVal) {  //установка ползунка в позицию "по-умолчанию" = sliderValue
      let defaultValues = [];
      let currentValue = 0;
      if (slVal <= slMin) {
        slVal = slMin;
      }
      else if (slVal >= slMax) {
        slVal = slMax;
      }

      let sliderMin = slMin;
      for (var i = 0; currentValue < slMax; i++) {
        if (sliderMin > slMax) {
          break;
        }
        else {
          currentValue = sliderMin;
          sliderMin += sliderStep;
          defaultValues.push(currentValue);
        }
      }

      if (($.inArray(sliderValue, defaultValues)) == -1) {
        slVal = slMin;
      }

      let stepOfDefaultPosition = (parseInt(sliderElem.css('width')) - 20) / (defaultValues.length - 1);
      let currentInndexDefaultPosition = $.inArray(slVal, defaultValues);
      let defaultPosition = currentInndexDefaultPosition * stepOfDefaultPosition;
      sliderValue = slVal;

      if (currentInndexDefaultPosition == -1) {
        defaultPosition = 0;
        sliderValue = defaultValues[0];
      }
      valueElem.html(sliderValue);
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
      + '<label>Текущее значение</label><input type="number" class="config_currentValue" min="' + sliderMin + '" max="' + sliderMax + '" >'
      + '<label>Минимальное значение слайдера</label><input type="number" class="config_minValue">'
      + '<label>Максимальное значение слайдера</label><input type="number" class="config_maxValue">'
      + '<label>Размер шага слайдера</label><input type="number" class="config_sizeOfStep" min="1" max="' + (sliderMax - sliderMin) + '">');


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
      handleElem.css('left', defaultValue(sliderMax, sliderMin, parseInt(this.value)));
      this.value = sliderValue;

    })//complete

    $('.config_minValue:eq(0)').val(sliderMin);
    $('.config_minValue:eq(0)').focusout(function () { //минимальное значение слайдера
      sliderMin = parseInt(this.value);
      handleElem.css('left', defaultValue(sliderMax, sliderMin, sliderValue));
      $('.config_currentValue:eq(0)').attr('min', sliderMin);
      $('.config_sizeOfStep:eq(0)').attr('max', (sliderMax - sliderMin));
    }) //complete


    $('.config_maxValue:eq(0)').val(sliderMax);
    $('.config_maxValue:eq(0)').focusout(function () { //максимальное значение слайдера
      sliderMax = parseInt(this.value);
      handleElem.css('left', defaultValue(sliderMax, sliderMin, sliderValue));
      $('.config_currentValue:eq(0)').attr('max', sliderMax);
      $('.config_sizeOfStep:eq(0)').attr('max', (sliderMax - sliderMin));
    }) //complete


    $('.config_sizeOfStep:eq(0)').val(sliderStep);
    $('.config_sizeOfStep:eq(0)').focusout(function () { //размера шага слайдера
      sliderStep = parseInt(this.value);
      $('.config_currentValue:eq(0)').attr('max', sliderMax);
    })
  }
})(jQuery);
