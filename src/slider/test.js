
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
    let sliderValue = 5;

    //присваивание переменных соответствующим элементам
    let sliderElem = $('.slider:eq(0)');
    let handleElem = $('.slider_handle:eq(0)');
    let valueElem = $('.slider_handle_value:eq(0)');

    let testValue=false;
    getInfoPositionSlider();
    function getInfoPositionSlider() {
      $('.config_orientation:eq(0)').on('change', function () {
        if (this.checked) {
          testValue = true;
        }
        else {
          testValue = false;
        }
        return testValue;
      })
    };


    valueElem.html(sliderValue);
    handleElem.css('left', defaultValue(sliderMax, sliderMin));

    handleElem.mousedown(function (event) { //событие нажатой ЛКМ
      getInfoPositionSlider();
      let sliderCoords = getCoords(sliderElem); //внутренние координаты слайдера
      let handleCoords = getCoords(handleElem); //внутренние координаты ползунка
      let shift; //координаты левого края элемента
      if (testValue == true) {
        shift = event.pageY - handleCoords.top;
      } else {
        shift = event.pageX - handleCoords.left;
      }
      // движение нажатой ЛКМ
      $(document).on('mousemove', function (event) {
        //вычисление левого края слайдера и задание координат для ползунка
        let beginEdge;
        let endEdge;
        if (testValue) {
          beginEdge = event.pageY - shift - sliderCoords.top;
          if (beginEdge < 0) {
            beginEdge = 0;
          }
          endEdge = sliderElem.outerWidth() - handleElem.outerWidth();
          if (beginEdge > endEdge) {
            beginEdge = endEdge;
          }
          handleElem.css('left', beginEdge + 'px');
        }
        else {
          beginEdge = event.pageX - shift - sliderCoords.left;
          if (beginEdge < 0) {
            beginEdge = 0;
          }
          endEdge = sliderElem.outerWidth() - handleElem.outerWidth();
          if (beginEdge > endEdge) {
            beginEdge = endEdge;
          }
          handleElem.css('left', beginEdge + 'px');
        }

        console.log('');
        console.log(testValue);

        console.log('event.pageX ' + event.pageX);
        console.log('event.pageY ' + event.pageY);
        console.log('shift ' + shift);
        console.log('sliderCoords.left ' + sliderCoords.left);
        console.log('sliderCoords.top ' + sliderCoords.top);
        console.log('beginEdge ' + beginEdge);
        console.log('endEdge ' + endEdge);

        calculateSliderValue(sliderMax, sliderMin, beginEdge);
      });

      $(document).mouseup(function () {  //событие ОТжатой ЛКМ, отмена "mousemove"
        $(document).off('mousemove');
      });
    });

    sliderElem.click(function (event) { //обработка клика ЛКМ по шкале слайдера
      let sliderCoords = getCoords(sliderElem); //внутренние координаты слайдера
      let shift;
      if (testValue) {
        shift = event.pageY - sliderCoords.top - (handleElem.outerHeight() / 2);
      } else {
        shift = event.pageX - sliderCoords.left - (handleElem.outerWidth() / 2);
      }
      handleElem.animate({ left: shift + 'px' }, 300, calculateSliderValue(sliderMax, sliderMin, shift))
    })

    function calculateSliderValue(slMax, slMin, beginEdge) { //расчет значения над ползунком
      let sliderWidth = parseInt(sliderElem.css('width'));
      let sliderStep = (sliderWidth / (slMax - slMin)) * 0.96;
      let currentSliderValue = (beginEdge / sliderStep) ^ 0;

      let values = [];
      let currentValue = 0;
      for (var i = 0; currentValue < slMax; i++) {
        currentValue = slMin;
        slMin++;
        values.push(currentValue);
      }
      valueElem.html(values[currentSliderValue]);
    }

    function defaultValue(slMax, slMin) {  //установка ползунка в позицию "по-умолчанию" = sliderValue
      let defaultPosition = (parseInt(sliderElem.css('width')) / (slMax - slMin)) * 0.96;

      let values = [];
      let currentValue = 0;
      for (var i = 0; currentValue < slMax; i++) {
        currentValue = slMin;
        slMin++;
        values.push(currentValue);
      }
      defaultPosition = values.indexOf(sliderValue) * defaultPosition;
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
    $('.config_panel').html('<label><input type="checkbox" class="config_orientation">Включить вертикальное отображение</label>' + '<label><input type="checkbox" class="config_range">Включить выбор интервала</label>' + '<label><input type="checkbox" class="config_showHandleValue">Включить отображение флажка</label>' +
      '<label>Минимальное значение слайдера</label><input type="number" class="config_minValue">' + '<label>Максимальное значение слайдера</label><input type="number" class="config_maxValue">' +
      '<label>Текущее значение</label><input type="number" class="config_currentValue">' + '<label>Размер шага слайдера</label><input type="number" class="config_sizeOfStep">');

    // test();
    // function test() {
    //   getInfoPositionSlider();
    //   $('.config_orientation:eq(0)').click()
    //   $('.block_slider:eq(0)').addClass('verticalBlockSlider');
    //   $('.slider:eq(0)').addClass('verticalSlider');
    //   $('.slider_handle:eq(0)').addClass('verticalSlider_handle');
    //   $('.slider_handle_value:eq(0)').addClass('verticalSlider_handle_value');
    // }

    $('.config_orientation:eq(0)').change(function () {  //вкл/выкл вертикальной ориентации
      getInfoPositionSlider();
      if (this.checked) {
        $('.block_slider:eq(0)').addClass('verticalBlockSlider');
        $('.slider:eq(0)').addClass('verticalSlider');
        $('.slider_handle:eq(0)').addClass('verticalSlider_handle');
        $('.slider_handle_value:eq(0)').addClass('verticalSlider_handle_value');
      }
      else {
        $('.block_slider:eq(0)').removeClass('verticalBlockSlider');
        $('.slider:eq(0)').removeClass('verticalSlider');
        $('.slider_handle:eq(0)').removeClass('verticalSlider_handle');
        $('.slider_handle_value:eq(0)').removeClass('verticalSlider_handle_value');

      }
    })

    $('.config_range:eq(0)').change(function () {  //вкл/выкл выбор диапазона
      if (this.checked) {
        console.log('config_range checked');
      }
      else {
        console.log('config_range unchecked');
      }
    })


    $('.config_showHandleValue:eq(0)').change(function () {  //показать/скрыть значение над ползунком
      if (this.checked) {
        console.log('config_showHandleValue checked');
      }
      else {
        console.log('config_showHandleValue unchecked');
      }
    })


    $('.config_minValue:eq(0)').mouseup(function () { //минимальное значение слайдера
      if (this.value) {
        console.log('config_minValue ' + this.value);
      }
      else {
        console.log('config_minValue [0]');
      }
    })
    $('.config_minValue:eq(0)').keyup(function () {
      if (this.value) {
        console.log('config_minValue ' + this.value);
      }
      else {
        console.log('config_minValue 0');
      }
    })


    $('.config_maxValue:eq(0)').mouseup(function () { //максимальное значение слайдера
      if (this.value) {
        console.log('config_maxValue ' + this.value);
      }
      else {
        console.log('config_maxValue [0]');
      }
    })
    $('.config_maxValue:eq(0)').keyup(function () {
      if (this.value) {
        console.log('config_maxValue ' + this.value);
      }
      else {
        console.log('config_maxValue 0');
      }
    })


    $('.config_currentValue:eq(0)').mouseup(function () { //текущее значение слайдера
      if (this.value) {
        console.log('config_currentValue ' + this.value);
      }
      else {
        console.log('config_currentValue [0]');
      }
    })
    $('.config_currentValue:eq(0)').keyup(function () {
      if (this.value) {
        console.log('config_currentValue ' + this.value);
      }
      else {
        console.log('config_currentValue 0');
      }
    })


    $('.config_sizeOfStep:eq(0)').mouseup(function () { //размера шага слайдера
      if (this.value) {
        console.log('config_sizeOfStep ' + this.value);
      }
      else {
        console.log('config_sizeOfStep [0]');
      }
    })
    $('.config_sizeOfStep:eq(0)').keyup(function () {
      if (this.value) {
        console.log('config_sizeOfStep ' + this.value);
      }
      else {
        console.log('config_sizeOfStep 0');
      }
    })





  }
})(jQuery);
