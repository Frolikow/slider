
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

    let sliderMin = -3;
    let sliderMax = 2;
    let sliderValue = 1;

    //присваивание переменных соответствующим элементам
    let sliderElem = $('.slider:eq(0)');
    let handleElem = $('.slider_handle:eq(0)');
    let valueElem = $('.slider_handle_value:eq(0)');

    let verticalOrientation = false;
    getInfoOrientationSlider();
    function getInfoOrientationSlider() {
      $('.config_orientation:eq(0)').on('change', function () {
        if (this.checked) {
          verticalOrientation = true;
        }
        else {
          verticalOrientation = false;
        }
        return verticalOrientation;
      })
    };

    handleElem.css('left', defaultValue(sliderMax, sliderMin, sliderValue));

    handleElem.mousedown(function (event) { //событие нажатой ЛКМ
      getInfoOrientationSlider();
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
        if (verticalOrientation) {
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
      let sliderStep = (sliderWidth / (slMax - slMin)) * 0.96;
      let currentSliderValue = (beginEdge / sliderStep) ^ 0;

      let values = [];
      let currentValue = 0;
      for (var i = 0; currentValue < slMax; i++) {
        currentValue = slMin;
        slMin++;
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
        console.log('(slVal < slMin)');
        slVal = slMin;
      }
      else if (slVal > slMax) {
        console.log('(slVal > slMax)');
        slVal = slMax;
      }
      else {
        console.log('OK');
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
      getInfoOrientationSlider();
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
    }) //complete


    // test();
    // function test(){
    //   $('.config_range:eq(0)').click();
    // }

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
      // debugger;
      valueElem.html(this.value);
      handleElem.css('left', defaultValue(sliderMax, sliderMin, parseInt(this.value)));
      // console.log(defaultValue(sliderMax, sliderMin, sliderValue))
    })//complete

    // let rng = document.querySelector('.range [type=range]')
    // let txt = document.querySelector('.range [type=text]')

    // rng.addEventListener('input', () => 
    //   txt.value = rng.value
    // )
    // txt.addEventListener('input', () => 
    //   rng.value = txt.value
    // )





    $('.config_minValue:eq(0)').mouseup(function () { //минимальное значение слайдера
      if (this.value) {
        // console.log('config_minValue ' + this.value);
        console.log(sliderValue)
      }
      else {
        console.log(sliderValue)
        // console.log('config_minValue [0]');
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
