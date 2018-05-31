'use strict';

var OMVC = {};

OMVC.Model = function () {
  var thisModel = this;

  this.sliderMin = 1;
  this.sliderMax = 10;
  this.sliderValue = 3;
  this.sliderValueRange = 7;
  this.sliderStep = 1;
  this.verticalOrientation = false;
  this.sliderRangeStatus = false;

  this.sliderElem;
  this.handleElem;
  this.valueElem;

  this.handleElemRange;
  this.valueElemRange;
  this.configCurrentValueRange;

  this.createHandleRange = function () {
    if (thisModel.sliderRangeStatus) {
      $('.config_currentValue:eq(0)').attr('max', (thisModel.sliderValueRange - thisModel.sliderStep))
      thisModel.handleElemRange.css('display', 'block')
      thisModel.configCurrentValueRange.css('display', 'block')
      thisModel.configCurrentValueRange.val(thisModel.sliderValueRange);
      thisModel.valueElemRange.text(thisModel.sliderValueRange);
      if (thisModel.sliderValue >= thisModel.sliderValueRange) {
        thisModel.sliderValueRange = thisModel.sliderValue;
        thisModel.sliderValue = thisModel.sliderValueRange - thisModel.sliderStep;
        thisModel.handleElem.css('left', thisModel.defaultValue(thisModel.sliderMax, thisModel.sliderMin, thisModel.sliderValue, thisModel.valueElem));
        thisModel.handleElemRange.css('left', thisModel.defaultValue(thisModel.sliderMax, thisModel.sliderMin, thisModel.sliderValueRange, thisModel.valueElemRange));
      }
      else {
        thisModel.handleElemRange.css('left', thisModel.defaultValue(thisModel.sliderMax, thisModel.sliderMin, thisModel.sliderValueRange, thisModel.valueElemRange));
      }
      thisModel.configCurrentValueRange.focusout(function () {
        thisModel.sliderValueRange = parseInt(this.value);
        thisModel.handleElemRange.css('left', thisModel.defaultValue(thisModel.sliderMax, thisModel.sliderMin, thisModel.sliderValueRange, thisModel.valueElemRange));
        thisModel.valueElemRange.text(thisModel.sliderValueRange);
        $('.config_currentValue:eq(0)').attr('max', (thisModel.sliderValueRange - thisModel.sliderStep))
      })
    }
    else {
      thisModel.handleElemRange.css('display', 'none')
      thisModel.configCurrentValueRange.css('display', 'none')
      $('.config_currentValue:eq(0)').attr('max', thisModel.sliderMax)
    }
  };

  this.defaultValue = function (slMax, slMin, slVal, currentElem) {  //установка ползунка в позицию "по-умолчанию" = sliderValue
    let defaultValuesArray = [];
    let currentValue = 0;

    if (slVal <= slMin) {
      slVal = slMin;
    }
    else if (slVal >= slMax) {
      slVal = slMax;
    }

    let defSliderMin = slMin;
    for (var i = 0; currentValue < slMax; i++) {
      if (defSliderMin > slMax) {
        break;
      }
      else {
        currentValue = defSliderMin;
        defSliderMin += thisModel.sliderStep;
        defaultValuesArray.push(currentValue);
      }
    }

    if (currentElem == thisModel.valueElem) {
      if (($.inArray(thisModel.sliderValue, defaultValuesArray)) === -1) {
        slVal = slMin;
      }
    }
    else if (currentElem == thisModel.valueElemRange) {
      if (($.inArray(thisModel.sliderValueRange, defaultValuesArray)) === -1) {
        slVal = slMax;
      }
    }
    let sliderWidth = thisModel.sliderElem.outerWidth() - thisModel.handleElem.outerWidth();
    let stepOfDefaultPosition = sliderWidth / (defaultValuesArray.length - 1);
    let currentIndexDefaultPosition = $.inArray(slVal, defaultValuesArray);
    let defaultPosition = currentIndexDefaultPosition * stepOfDefaultPosition;

    if (currentElem == thisModel.valueElem) {
      thisModel.sliderValue = slVal;
      if (currentIndexDefaultPosition == -1) {
        defaultPosition = 0;
        thisModel.sliderValue = defaultValuesArray[0];
      }
      currentElem.html(thisModel.sliderValue);
      $('.config_currentValue:eq(0)').val(thisModel.sliderValue);
    }
    else if (currentElem == thisModel.valueElemRange) {
      thisModel.sliderValueRange = slVal;
      if (currentIndexDefaultPosition == -1) {
        defaultPosition = stepOfDefaultPosition * (defaultValuesArray.length - 1);
        thisModel.sliderValueRange = defaultValuesArray[defaultValuesArray.length - 1];
      }
      currentElem.html(thisModel.sliderValueRange);
      $('.config_currentValueRange:eq(0)').val(thisModel.sliderValueRange);
    }
    return defaultPosition;
  };

  this.calculateSliderValue = function (slMax, slMin, begin, rangeStatus) { //расчет значения над ползунком
    let sliderWidth = thisModel.sliderElem.outerWidth() - thisModel.handleElem.outerWidth();
    let values = [];
    let currentValue = 0;
    for (var i = 0; currentValue < slMax; i++) {
      if (slMin > slMax) {
        break;
      }
      else {
        currentValue = slMin;
        slMin += thisModel.sliderStep;
        values.push(currentValue);
      }
    }
    let sliderValueStep = sliderWidth / (values[values.length - 1] - values[0]);
    let currentSliderValue = ((begin + (sliderValueStep / 2)) / sliderValueStep) ^ 0;

    if (rangeStatus) {
      if (currentSliderValue <= $.inArray(thisModel.sliderValue, values)) {
        thisModel.valueElemRange.html(thisModel.sliderValue + thisModel.sliderStep);
        thisModel.sliderValueRange = parseInt(thisModel.valueElemRange.text());
        thisModel.configCurrentValueRange.val(thisModel.sliderValue + thisModel.sliderStep);
      }
      else {
        thisModel.valueElemRange.html(values[currentSliderValue]);
        thisModel.sliderValueRange = parseInt(thisModel.valueElemRange.text());
        thisModel.configCurrentValueRange.val(thisModel.sliderValueRange);
      }
    }
    else {
      if (thisModel.sliderRangeStatus && currentSliderValue >= $.inArray((thisModel.sliderValueRange - thisModel.sliderStep), values)) {
        thisModel.valueElem.html(thisModel.sliderValueRange - thisModel.sliderStep);
        thisModel.sliderValue = parseInt(thisModel.valueElem.text());
        $('.config_currentValue:eq(0)').val(thisModel.sliderValueRange - thisModel.sliderStep);
      }
      else {
        thisModel.valueElem.html(values[currentSliderValue]);
        thisModel.sliderValue = parseInt(thisModel.valueElem.text());
        $('.config_currentValue:eq(0)').val(thisModel.sliderValue);
      }
    }
  };

  this.getCoords = function (elem) { //получение координат курсора внутри элемента
    let box = elem.get(0).getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }

  this.clickOnSlider = function () {  //обработка клика ЛКМ по шкале слайдера
    let clickPositionArray = [];
    let clickPositionValue = 0;
    let slMin = thisModel.sliderMin;
    let slMax = thisModel.sliderMax;
    for (var i = 0; clickPositionValue < slMax; i++) {
      if (slMin > slMax) {
        break;
      }
      else {
        clickPositionValue = slMin;
        slMin += thisModel.sliderStep;
        clickPositionArray.push(clickPositionValue);
      }
    }

    let shift;
    let sliderCoords = thisModel.getCoords(thisModel.sliderElem); //внутренние координаты слайдера
    if (thisModel.verticalOrientation) {
      shift = event.pageY - sliderCoords.top - (thisModel.handleElem.outerHeight() / 2);
    } else {
      shift = event.pageX - sliderCoords.left - (thisModel.handleElem.outerWidth() / 2);
    }


    let sliderWidth = thisModel.sliderElem.outerWidth() - thisModel.handleElem.outerWidth();
    let clickSliderValueStep = (sliderWidth / ((clickPositionArray[clickPositionArray.length - 1] - clickPositionArray[0]) / thisModel.sliderStep));

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

    if (thisModel.sliderRangeStatus) {
      if (moveToPosition < parseInt(thisModel.handleElem.css('left'))) {
        thisModel.handleElem.animate({ left: moveToPosition + 'px' }, 300, thisModel.calculateSliderValue(thisModel.sliderMax, thisModel.sliderMin, shift / thisModel.sliderStep, false));
      }
      else if (moveToPosition > parseInt(thisModel.handleElemRange.css('left'))) {
        thisModel.handleElemRange.animate({ left: moveToPosition + 'px' }, 300, thisModel.calculateSliderValue(thisModel.sliderMax, thisModel.sliderMin, shift / thisModel.sliderStep, true));
      }
      else {
        if ((moveToPosition - parseInt(thisModel.handleElem.css('left'))) > (parseInt(thisModel.handleElemRange.css('left')) - moveToPosition)) {
          thisModel.handleElemRange.animate({ left: moveToPosition + 'px' }, 300, thisModel.calculateSliderValue(thisModel.sliderMax, thisModel.sliderMin, shift / thisModel.sliderStep, true));
        }
        else if ((moveToPosition - parseInt(thisModel.handleElem.css('left'))) < (parseInt(thisModel.handleElemRange.css('left')) - moveToPosition)) {
          thisModel.handleElem.animate({ left: moveToPosition + 'px' }, 300, thisModel.calculateSliderValue(thisModel.sliderMax, thisModel.sliderMin, shift / thisModel.sliderStep, false));
        }
      }
    }
    else {
      thisModel.handleElem.animate({ left: moveToPosition + 'px' }, 300, thisModel.calculateSliderValue(thisModel.sliderMax, thisModel.sliderMin, shift / thisModel.sliderStep, false));
    }
  }

  this.mouseDown = function (event, actualElement) {//событие нажатой ЛКМ
    let sliderCoords = thisModel.getCoords(thisModel.sliderElem); //внутренние координаты слайдера
    let handleCoords = thisModel.getCoords(actualElement); //внутренние координаты ползунка
    let shift; //координаты левого края элемента
    if (thisModel.verticalOrientation == true) {
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
      let slMin = thisModel.sliderMin;
      let slMax = thisModel.sliderMax;
      for (var i = 0; currentValue < slMax; i++) {
        if (slMin > slMax) {
          break;
        }
        else {
          currentValue = slMin;
          slMin += thisModel.sliderStep;
          position.push(currentValue);
        }
      }

      let positionRange = [];
      slMin = thisModel.sliderMin;
      currentValue = 0;
      if (actualElement == thisModel.handleElem) {
        slMax = thisModel.sliderValueRange - thisModel.sliderStep;
      }
      for (var i = 0; currentValue < slMax; i++) {
        if (slMin > slMax) {
          break;
        }
        else {
          currentValue = slMin;
          slMin += thisModel.sliderStep;
          positionRange.push(currentValue);
        }
      }
      if (thisModel.verticalOrientation) {
        beginEdge = (event.pageY - shift - sliderCoords.top) / thisModel.sliderStep;
      }
      else {
        beginEdge = (event.pageX - shift - sliderCoords.left) / thisModel.sliderStep;
      }

      if (beginEdge < 0) {
        beginEdge = 0;
      }
      endEdge = thisModel.sliderElem.outerWidth() - actualElement.outerWidth();
      if (beginEdge > endEdge) {
        beginEdge = endEdge;
      }
      actualElement.css('left', thisModel.searchPosition(beginEdge, endEdge, position, positionRange, actualElement) + 'px');

      if (actualElement == thisModel.handleElem) {
        thisModel.calculateSliderValue(thisModel.sliderMax, thisModel.sliderMin, beginEdge, false);
      }
      else if (actualElement == thisModel.handleElemRange) {
        thisModel.calculateSliderValue(thisModel.sliderMax, thisModel.sliderMin, beginEdge, true);
      }
    });

    $(document).mouseup(function () {  //событие ОТжатой ЛКМ, отмена "mousemove"
      $(document).off('mousemove');
    });
  }

  this.searchPosition = function (begin, end, position, positionRange, element) {
    let widthOfstep = (end / (position.length - 1));
    let halfWidthOfStep = (widthOfstep / 2);

    let currentIndex = $.inArray(thisModel.sliderValue, position);
    let currentPositionHandle = widthOfstep * currentIndex;

    let currentIndexRange = $.inArray(thisModel.sliderValueRange - thisModel.sliderStep, positionRange)
    let currentPositionHandleRange = widthOfstep * currentIndexRange;

    let currentPositionCursor = begin * thisModel.sliderStep;
    let middleOfPosition = currentPositionHandle + halfWidthOfStep;



    if (element == thisModel.handleElem) {
      if (thisModel.sliderRangeStatus) {
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
    }
    
    else if (element == thisModel.handleElemRange) {
      if (currentPositionCursor >= (widthOfstep * (position.length - 1)) || thisModel.sliderValueRange == -1) {
        currentPositionHandleRange = end;
      }
      else if (thisModel.sliderValueRange <= thisModel.sliderValue+thisModel.sliderStep) {
        currentPositionHandleRange = widthOfstep * $.inArray((thisModel.sliderValue + thisModel.sliderStep), position);
      }
      else {
        if (currentPositionCursor <= middleOfPosition) {
          currentPositionHandleRange = widthOfstep * currentIndexRange;
        }
        else if (currentPositionCursor > middleOfPosition) {
          currentPositionHandleRange = widthOfstep * currentIndexRange + widthOfstep;
        }
      }
      currentPositionHandle = currentPositionHandleRange;
    }



    return currentPositionHandle;
  }

};
//////////___Model___/////////////////////////////////////___ViewSlider___///////////////////////
OMVC.ViewSlider = function () {
  $('.block_slider').html('<div class="slider">');
  $('.slider').html('<div class="slider_handle slider_handle_left">');
  $('.slider_handle_left').html('<div class="slider_handle_value slider_handle_value_left">');
  $('.slider_handle:eq(0)').after('<div class="slider_handle slider_handle_right"> <div class="slider_handle_value slider_handle_value_right">');

};
//////___ViewSlider___////////////////////////////___ViewConfiguration___////////////////////////
OMVC.ViewConfiguration = function () {
  $('.block_config').html('<div class="config_panel">')
  $('.config_panel').html('<label> <input type="checkbox" class="config_showHandleValue">Убрать флажок</label>'
    + '<label> <input type="checkbox" class="config_orientation">Включить вертикальное отображение</label>'
    + '<label> <input type="checkbox" class="config_range">Включить выбор интервала</label>'
    + '<label>Текущее значение</label> <div class="config_block_currentValue"> <input type="number" class="config_currentValue"> </div>'
    + '<label>Минимальное значение слайдера</label> <input type="number" class="config_minValue">'
    + '<label>Максимальное значение слайдера</label> <input type="number" class="config_maxValue">'
    + '<label>Размер шага слайдера</label> <input type="number" class="config_sizeOfStep">');

  $('.config_currentValue:eq(0)').after('<input type="number" class="config_currentValueRange">')

};
/////////___ViewConfiguration___///////////////////////////////////___Controller___//////////////
OMVC.Controller = function (model, view, viewConfig) {
  model.sliderElem = $('.slider:eq(0)');
  model.handleElem = $('.slider_handle_left:eq(0)');
  model.valueElem = $('.slider_handle_value_left:eq(0)');

  $('.config_currentValue:eq(0)').attr({ 'min': model.sliderMin, 'max': model.sliderMax, 'value': model.sliderValue });
  $('.config_minValue:eq(0)').attr({ 'max': (model.sliderMax - model.sliderStep), 'value': model.sliderMin });
  $('.config_maxValue:eq(0)').attr({ 'min': (model.sliderMin + model.sliderStep), 'value': model.sliderMax });
  $('.config_sizeOfStep:eq(0)').attr({ 'min': 1, 'max': (model.sliderMax - model.sliderMin), 'value': model.sliderStep });
  $('.config_currentValueRange:eq(0)').attr({ 'min': (model.sliderValue + model.sliderStep), 'max': model.sliderMax, 'value': model.sliderValueRange });

  model.handleElemRange = $('.slider_handle_right:eq(0)');
  model.valueElemRange = $('.slider_handle_value_right:eq(0)');
  model.configCurrentValueRange = $('.config_currentValueRange:eq(0)')

  model.handleElemRange.css('display', 'none')
  model.configCurrentValueRange.css('display', 'none')

  model.handleElem.css('left', model.defaultValue(model.sliderMax, model.sliderMin, model.sliderValue, model.valueElem));

  $('.config_showHandleValue:eq(0)').change(function () {  //убрать флажок
    if (this.checked) {
      model.valueElem.css('display', 'none');
      model.valueElemRange.css('display', 'none');
    }
    else {
      model.valueElem.css('display', 'block');
      model.valueElemRange.css('display', 'block');
    }
  })//complete

  $('.config_orientation:eq(0)').change(function () {  //вкл/выкл вертикальной ориентации
    if (this.checked) {
      $('.block_slider:eq(0)').addClass('verticalBlockSlider');
      $('.slider:eq(0)').addClass('verticalSlider');
      $('.slider_handle:eq(0)').addClass('verticalSlider_handle');
      $('.slider_handle_value:eq(0)').addClass('verticalSlider_handle_value');
      $('.slider_handle_right:eq(0)').addClass('verticalSlider_handle');
      $('.slider_handle_value_right:eq(0)').addClass('verticalSlider_handle_value');
      model.verticalOrientation = true;
    }
    else {
      $('.block_slider:eq(0)').removeClass('verticalBlockSlider');
      $('.slider:eq(0)').removeClass('verticalSlider');
      $('.slider_handle:eq(0)').removeClass('verticalSlider_handle');
      $('.slider_handle_value:eq(0)').removeClass('verticalSlider_handle_value');
      $('.slider_handle_right:eq(0)').removeClass('verticalSlider_handle');
      $('.slider_handle_value_right:eq(0)').removeClass('verticalSlider_handle_value');
      model.verticalOrientation = false;
    }
  })//complete

  $('.config_range:eq(0)').change(function () {  //вкл/выкл выбор диапазона
    if (model.sliderRangeStatus) {
      model.sliderRangeStatus = false;
    }
    else {
      model.sliderRangeStatus = true;
    }
    model.createHandleRange();

  })

  $('.config_currentValue:eq(0)').focusout(function () { //текущее значение слайдера
    model.handleElem.css('left', model.defaultValue(model.sliderMax, model.sliderMin, parseInt(this.value), model.valueElem));
    this.value = model.sliderValue;
    model.configCurrentValueRange.attr('min', (model.sliderValue + model.sliderStep))
  })//complete

  $('.config_minValue:eq(0)').focusout(function () { //минимальное значение слайдера
    model.sliderMin = parseInt(this.value);
    model.handleElem.css('left', model.defaultValue(model.sliderMax, model.sliderMin, model.sliderValue, model.valueElem));
    if (model.sliderRangeStatus) {
      model.handleElemRange.css('left', model.defaultValue(model.sliderMax, model.sliderMin, model.sliderValueRange, model.valueElemRange));
    }
    $('.config_currentValue:eq(0)').attr('min', model.sliderMin);
    $('.config_sizeOfStep:eq(0)').attr('max', (model.sliderMax - model.sliderMin));
  }) //complete

  $('.config_maxValue:eq(0)').focusout(function () { //максимальное значение слайдера
    model.sliderMax = parseInt(this.value);
    model.handleElem.css('left', model.defaultValue(model.sliderMax, model.sliderMin, model.sliderValue, model.valueElem));
    if (model.sliderRangeStatus) {
      model.handleElemRange.css('left', model.defaultValue(model.sliderMax, model.sliderMin, model.sliderValueRange, model.valueElemRange));
    }
    $('.config_currentValue:eq(0)').attr('max', model.sliderMax);
    $('.config_sizeOfStep:eq(0)').attr('max', (model.sliderMax - model.sliderMin));
    model.configCurrentValueRange.attr('max', model.sliderMax)
  }) //complete

  $('.config_sizeOfStep:eq(0)').focusout(function () { //размера шага слайдера
    model.sliderStep = parseInt(this.value);
    $('.config_currentValue:eq(0)').attr('max', model.sliderMax);
  })

  model.sliderElem.click(function () {
    model.clickOnSlider();
  })

  model.handleElem.mousedown(function (event) {
    let currentElement = model.handleElem;
    model.mouseDown(event, currentElement);
  });

  model.handleElemRange.mousedown(function (event) {
    let currentElement = model.handleElemRange;
    model.mouseDown(event, currentElement);
  });


};
////////___Controller___///////////////////////////////////////////___ready___///////////////////

$(document).ready(function () {
  var model = new OMVC.Model();
  var view = new OMVC.ViewSlider();
  var viewConfig = new OMVC.ViewConfiguration();
  var controller = new OMVC.Controller(model, view, viewConfig);

});
