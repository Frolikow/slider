
'use strict';

$(document).ready(function () {
  $('.block_slider').slider();
});

(function ($) {
  jQuery.fn.slider = function () {
    //создание элементов слайдера
    $('.block_slider').html('<div class="slider">');
    $('.slider').html('<div class="slider_handle slider_handle_left">');
    $('.slider_handle_left').html('<div class="slider_handle_value slider_handle_value_left">');

    let sliderMin = 1;
    let sliderMax = 20;
    let sliderValue = 5;
    let sliderValueRange = 15;
    let sliderStep = 1;
    let verticalOrientation = false;
    let sliderRangeStatus = false;

    //присваивание переменных соответствующим элементам
    let sliderElem = $('.slider:eq(0)');
    let handleElem = $('.slider_handle_left:eq(0)');
    let valueElem = $('.slider_handle_value_left:eq(0)');

    //создание элементов для панели конфигов
    $('.block_config').html('<div class="config_panel">')
    $('.config_panel').html('<label><input type="checkbox" class="config_showHandleValue">Убрать флажок</label>'
      + '<label><input type="checkbox" class="config_orientation">Включить вертикальное отображение</label>'
      + '<label><input type="checkbox" class="config_range">Включить выбор интервала</label>'

      + '<label>Текущее значение</label><div class="config_block_currentValue"><input type="number" class="config_currentValue" min="'
      + sliderMin + '" max="' + sliderMax + '" ></div>'
      + '<label>Минимальное значение слайдера</label><input type="number" class="config_minValue" max=' + (sliderMax - sliderStep) + '>'
      + '<label>Максимальное значение слайдера</label><input type="number" class="config_maxValue" min=' + (sliderMin + sliderStep) + '>'
      + '<label>Размер шага слайдера</label><input type="number" class="config_sizeOfStep" min="1" max="' + (sliderMax - sliderMin) + '">');

    $('.slider_handle:eq(0)').after('<div class="slider_handle slider_handle_right"><div class="slider_handle_value slider_handle_value_right">');
    $('.config_currentValue:eq(0)').after('<input type="number" class="config_currentValueRange" min="' + (sliderValue + sliderStep) + '" max="' + sliderMax + '" >')
    let handleElemRange = $('.slider_handle_right:eq(0)');
    let valueElemRange = $('.slider_handle_value_right:eq(0)');
    let configCurrentValueRange = $('.config_currentValueRange:eq(0)')

    handleElemRange.css('display', 'none')
    configCurrentValueRange.css('display', 'none')

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
        $('.slider_handle_right:eq(0)').addClass('verticalSlider_handle');
        $('.slider_handle_value_right:eq(0)').addClass('verticalSlider_handle_value');
        verticalOrientation = true;
      }
      else {
        $('.block_slider:eq(0)').removeClass('verticalBlockSlider');
        $('.slider:eq(0)').removeClass('verticalSlider');
        $('.slider_handle:eq(0)').removeClass('verticalSlider_handle');
        $('.slider_handle_value:eq(0)').removeClass('verticalSlider_handle_value');
        $('.slider_handle_right:eq(0)').removeClass('verticalSlider_handle');
        $('.slider_handle_value_right:eq(0)').removeClass('verticalSlider_handle_value');
        verticalOrientation = false;
      }
    }) //complete


    function createHandleRange() {
      if (sliderRangeStatus) {
        $('.config_currentValue:eq(0)').attr('max', (sliderValueRange - sliderStep))
        handleElemRange.css('display', 'block')
        configCurrentValueRange.css('display', 'block')
        configCurrentValueRange.val(sliderValueRange);
        valueElemRange.text(sliderValueRange);
        if (sliderValue >= sliderValueRange) {
          sliderValueRange = sliderValue;
          sliderValue = sliderValueRange - sliderStep;
          handleElem.css('left', defaultValue(sliderMax, sliderMin, sliderValue, valueElem));
          handleElemRange.css('left', defaultValue(sliderMax, sliderMin, sliderValueRange, valueElemRange));
        }
        else {
          handleElemRange.css('left', defaultValue(sliderMax, sliderMin, sliderValueRange, valueElemRange));
        }
        configCurrentValueRange.focusout(function () {
          sliderValueRange = parseInt(this.value);
          handleElemRange.css('left', defaultValue(sliderMax, sliderMin, sliderValueRange, valueElemRange));
          valueElemRange.text(sliderValueRange);
          $('.config_currentValue:eq(0)').attr('max', (sliderValueRange - sliderStep))
        })
      }
      else {
        handleElemRange.css('display', 'none')
        configCurrentValueRange.css('display', 'none')
        $('.config_currentValue:eq(0)').attr('max', sliderMax)
      }
    }
    $('.config_range:eq(0)').change(function () {  //вкл/выкл выбор диапазона
      if (sliderRangeStatus) {
        sliderRangeStatus = false;
      }
      else {
        sliderRangeStatus = true;
      }
      createHandleRange();

    })
    
    $('.config_currentValue:eq(0)').val(sliderValue);
    $('.config_currentValue:eq(0)').focusout(function () { //текущее значение слайдера
      handleElem.css('left', defaultValue(sliderMax, sliderMin, parseInt(this.value), valueElem));
      this.value = sliderValue;
      configCurrentValueRange.attr('min', (sliderValue + sliderStep))
    })//complete
    
    $('.config_minValue:eq(0)').val(sliderMin);
    $('.config_minValue:eq(0)').focusout(function () { //минимальное значение слайдера
      sliderMin = parseInt(this.value);
      handleElem.css('left', defaultValue(sliderMax, sliderMin, sliderValue, valueElem));
      if (sliderRangeStatus) {
        handleElemRange.css('left', defaultValue(sliderMax, sliderMin, sliderValueRange, valueElemRange));
      }
      $('.config_currentValue:eq(0)').attr('min', sliderMin);
      $('.config_sizeOfStep:eq(0)').attr('max', (sliderMax - sliderMin));
    }) //complete

    $('.config_maxValue:eq(0)').val(sliderMax);
    $('.config_maxValue:eq(0)').focusout(function () { //максимальное значение слайдера
      sliderMax = parseInt(this.value);
      handleElem.css('left', defaultValue(sliderMax, sliderMin, sliderValue, valueElem));
      if (sliderRangeStatus) {
        handleElemRange.css('left', defaultValue(sliderMax, sliderMin, sliderValueRange, valueElemRange));
      }
      $('.config_currentValue:eq(0)').attr('max', sliderMax);
      $('.config_sizeOfStep:eq(0)').attr('max', (sliderMax - sliderMin));
      configCurrentValueRange.attr('max', sliderMax)
    }) //complete
    
    $('.config_sizeOfStep:eq(0)').val(sliderStep);
    $('.config_sizeOfStep:eq(0)').focusout(function () { //размера шага слайдера
      sliderStep = parseInt(this.value);
      $('.config_currentValue:eq(0)').attr('max', sliderMax);
    })
    
    handleElem.css('left', defaultValue(sliderMax, sliderMin, sliderValue, valueElem));//готово
    
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


      let sliderWidth = sliderElem.outerWidth() - handleElem.outerWidth();
      let clickSliderValueStep = (sliderWidth / ((clickPositionArray[clickPositionArray.length - 1] - clickPositionArray[0]) / sliderStep));

      let moveToPosition;
      let currentSliderValue = ((shift + (clickSliderValueStep / 2)) / clickSliderValueStep) ^ 0;
      let clickMiddlePosition = parseInt((clickSliderValueStep * currentSliderValue) + (clickSliderValueStep / 2));

      if (shift < clickMiddlePosition) {
        moveToPosition = clickSliderValueStep * currentSliderValue;
      }
      else if (shift > clickMiddlePosition) {
        moveToPosition = clickSliderValueStep * currentSliderValue + clickSliderValueStep;
      }

      if (moveToPosition > sliderWidth) {
        moveToPosition = sliderWidth
      }

      if (sliderRangeStatus) {
        if (moveToPosition < parseInt(handleElem.css('left'))) {
          handleElem.animate({ left: moveToPosition + 'px' }, 300, calculateSliderValue(sliderMax, sliderMin, shift / sliderStep, false));
        }
        else if (moveToPosition > parseInt(handleElemRange.css('left'))) {
          handleElemRange.animate({ left: moveToPosition + 'px' }, 300, calculateSliderValue(sliderMax, sliderMin, shift / sliderStep, true));
        }
        else {
          if ((moveToPosition - parseInt(handleElem.css('left'))) > (parseInt(handleElemRange.css('left')) - moveToPosition)) {
            handleElemRange.animate({ left: moveToPosition + 'px' }, 300, calculateSliderValue(sliderMax, sliderMin, shift / sliderStep, true));
          }
          else if ((moveToPosition - parseInt(handleElem.css('left'))) < (parseInt(handleElemRange.css('left')) - moveToPosition)) {
            handleElem.animate({ left: moveToPosition + 'px' }, 300, calculateSliderValue(sliderMax, sliderMin, shift / sliderStep, false));
          }
        }
      }
      else {
        handleElem.animate({ left: moveToPosition + 'px' }, 300, calculateSliderValue(sliderMax, sliderMin, shift / sliderStep, false));
      }
    })
   
   
    ///////////////////////////////////////////////////////////////////////////////////////////// CURRENT CHANGES
    handleElemRange.mousedown(function (event) { //событие нажатой ЛКМ
      let sliderCoords = getCoords(sliderElem); //внутренние координаты слайдера
      let handleCoords = getCoords(handleElemRange); //внутренние координаты ползунка
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

        let positionRange = [];
        slMin = sliderValue + sliderStep;
        currentValue = 0;
        if (sliderRangeStatus) {
          for (var i = slMin; currentValue < slMax; i++) {
            if (slMin > slMax) {
              break;
            }
            else {
              currentValue = slMin;
              slMin += sliderStep;
              positionRange.push(currentValue);
            }
          }
        }

        if (verticalOrientation) {
          beginEdge = (event.pageY - shift - sliderCoords.top) / sliderStep;
        }
        else {
          beginEdge = (event.pageX - shift - sliderCoords.left) / sliderStep;
        }

        if (beginEdge < 0) {
          beginEdge = 0;
        }
        endEdge = sliderElem.outerWidth() - handleElem.outerWidth();
        if (beginEdge > endEdge) {
          beginEdge = endEdge;
        }
        handleElemRange.css('left', searchPosition(beginEdge, endEdge) + 'px');



        
        function searchPosition(begin, end) {
          let widthOfstep = (end / (position.length - 1));
          let halfWidthOfStep = (widthOfstep / 2);

          let currentIndex = $.inArray(sliderValueRange, position);
          let currentPositionHandle = widthOfstep * currentIndex;

          let currentPositionCursor = begin * sliderStep;
          let middleOfPosition = currentPositionHandle + halfWidthOfStep;

          if (currentPositionCursor >= (widthOfstep * (position.length - 1)) || currentIndex == -1) {
            currentPositionHandle = end;
          }
          else if (sliderValueRange <= sliderValue) {
            currentPositionHandle = widthOfstep * $.inArray((sliderValue + sliderStep), position);
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




        calculateSliderValue(sliderMax, sliderMin, beginEdge, true);
      });

      $(document).mouseup(function () {  //событие ОТжатой ЛКМ, отмена "mousemove"
        $(document).off('mousemove');
      });
    });

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

        let positionRange = [];
        slMin = sliderMin;
        currentValue = 0;
        if (sliderRangeStatus) {
          slMax = sliderValueRange - sliderStep;
          for (var i = 0; currentValue < slMax; i++) {
            if (slMin > slMax) {
              break;
            }
            else {
              currentValue = slMin;
              slMin += sliderStep;
              positionRange.push(currentValue);
            }
          }
        }

        if (verticalOrientation) {
          beginEdge = (event.pageY - shift - sliderCoords.top) / sliderStep;
        }
        else {
          beginEdge = (event.pageX - shift - sliderCoords.left) / sliderStep;
        }

        if (beginEdge < 0) {
          beginEdge = 0;
        }
        endEdge = sliderElem.outerWidth() - handleElem.outerWidth();
        if (beginEdge > endEdge) {
          beginEdge = endEdge;
        }
        handleElem.css('left', searchPosition(beginEdge, endEdge) + 'px');

        function searchPosition(begin, end) {
          let widthOfstep = (end / (position.length - 1));
          let halfWidthOfStep = (widthOfstep / 2);

          let currentIndex = $.inArray(sliderValue, position);
          let currentPositionHandle = widthOfstep * currentIndex;
          let currentIndexRange = $.inArray((sliderValueRange - sliderStep), positionRange)
          let currentPositionHandleRange = widthOfstep * currentIndexRange;

          let currentPositionCursor = begin * sliderStep;
          let middleOfPosition = currentPositionHandle + halfWidthOfStep;

          if (sliderRangeStatus) {
            if (currentPositionCursor >= (widthOfstep * (positionRange.length - 1)) || currentIndexRange == -1) {
              currentPositionHandle = currentPositionHandleRange;
            }
            else {
              if (currentPositionCursor <= middleOfPosition) {
                currentPositionHandle = widthOfstep * currentIndex;
              }
              else if (currentPositionCursor > middleOfPosition) {
                currentPositionHandle = widthOfstep * currentIndex + widthOfstep;
              }
            }
          }
          else {

            if (currentPositionCursor >= (widthOfstep * (position.length - 1)) || currentIndex == -1) {
              currentPositionHandle = end;
            }
            else {
              if (currentPositionCursor <= middleOfPosition) {
                currentPositionHandle = widthOfstep * currentIndex;
              }
              else if (currentPositionCursor > middleOfPosition) {
                currentPositionHandle = widthOfstep * currentIndex + widthOfstep;
              }
            }
          }
          return currentPositionHandle;
        }

        calculateSliderValue(sliderMax, sliderMin, beginEdge, false);
      });

      $(document).mouseup(function () {  //событие ОТжатой ЛКМ, отмена "mousemove"
        $(document).off('mousemove');
      });
    });



    //готово
    function calculateSliderValue(slMax, slMin, beginEdge, rangeStatus) { //расчет значения над ползунком
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

      if (rangeStatus) {
        if (currentSliderValue <= $.inArray(sliderValue, values)) {
          valueElemRange.html(sliderValue + sliderStep);
          sliderValueRange = parseInt(valueElemRange.text());
          configCurrentValueRange.val(sliderValue + sliderStep);
        }
        else {
          valueElemRange.html(values[currentSliderValue]);
          sliderValueRange = parseInt(valueElemRange.text());
          configCurrentValueRange.val(sliderValueRange);
        }
      }
      else {
        if (sliderRangeStatus && currentSliderValue >= $.inArray((sliderValueRange - sliderStep), values)) {
          valueElem.html(sliderValueRange - sliderStep);
          sliderValue = parseInt(valueElem.text());
          $('.config_currentValue:eq(0)').val(sliderValueRange - sliderStep);
        }
        else {
          valueElem.html(values[currentSliderValue]);
          sliderValue = parseInt(valueElem.text());
          $('.config_currentValue:eq(0)').val(sliderValue);
        }
      }
    }

    function defaultValue(slMax, slMin, slVal, currentElem) {  //установка ползунка в позицию "по-умолчанию" = sliderValue
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

      if (currentElem == valueElem) {
        if (($.inArray(sliderValue, defaultValues)) === -1) {
          slVal = slMin;
        }
      }
      else if (currentElem == valueElemRange) {
        if (($.inArray(sliderValueRange, defaultValues)) === -1) {
          slVal = slMax;
        }
      }

      let stepOfDefaultPosition = (parseInt(sliderElem.css('width')) - 20) / (defaultValues.length - 1);
      let currentIndexDefaultPosition = $.inArray(slVal, defaultValues);
      let defaultPosition = currentIndexDefaultPosition * stepOfDefaultPosition;

      if (currentElem == valueElem) {
        sliderValue = slVal;
        if (currentIndexDefaultPosition == -1) {
          defaultPosition = 0;
          sliderValue = defaultValues[0];
        }
        currentElem.html(sliderValue);
        $('.config_currentValue:eq(0)').val(sliderValue);
      }
      else if (currentElem == valueElemRange) {
        sliderValueRange = slVal;
        if (currentIndexDefaultPosition == -1) {
          defaultPosition = stepOfDefaultPosition * (defaultValues.length - 1);
          sliderValueRange = defaultValues[defaultValues.length - 1];
        }
        currentElem.html(sliderValueRange);
        $('.config_currentValueRange:eq(0)').val(sliderValueRange);
      }
      return defaultPosition;
    }
    
    
    
    function getCoords(elem) { //получение координат курсора внутри элемента
      let box = elem.get(0).getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };
    }
    
    //готово
  }
})(jQuery);
