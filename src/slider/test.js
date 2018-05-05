
'use strict';

$(document).ready(function () {
  $('.block_slider').slider();
});

(function ($) {
  jQuery.fn.slider = function () {
    //create slider elements
    let createScale = $('.block_slider').eq(0).html('<div class="slider">');
    let createSliderHandle = $('.slider').eq(0).html('<div class="slider_handle" id="test">');
    let createSliderHandleValue = $('.slider_handle').eq(0).html('<div class="slider_handle_value">32');
    // let sliderWidth = createSliderHandle.css('width');
    // console.log(sliderWidth);

    let handle = $('.slider_handle').eq(0);

    handle.mousedown(function (e) {
      // debugger;
      var coords = getCoords(handle);
      var shiftX = e.pageX - coords.left;
      //shiftX = растояние от левого края страницы - левый край элемента

      moveHandle(e);
      function moveHandle(e) {
        handle.css('left', shiftX + 'px');
      };

      document.mousemove = function (e) {
        moveHandle(e);
      }

      handle.mouseup = function () {
        // document.mousemove = null;
        handle.mouseup = null;
      }
    });

    /////////////
    handle.ondragstart = function () {
      return false;
    };

    function getCoords(elem) {
      var box = elem.get(0).getBoundingClientRect();
      return {
        left: box.left + pageXOffset
      };
    }

    //create configs panel element
    //создание инпутов чекбоксов и т.п.
  }
})(jQuery);
