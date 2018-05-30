'use strict';

var OMVC = {};

OMVC.Model = function () {
  var sliderMin = 1;
  var sliderMax = 20;
  var sliderValue = 5;
  var sliderValueRange = 15;
  var sliderStep = 1;
  var verticalOrientation = false;
  var sliderRangeStatus = false;

  var sliderElem;
  var handleElem;
  var valueElem;
};

//////////___Model___/////////////////////////////////////___ViewSlider___///////////////////////

OMVC.ViewSlider = function () {
  $('.block_slider').html('<div class="slider">');
  $('.slider').html('<div class="slider_handle slider_handle_left">');
  $('.slider_handle_left').html('<div class="slider_handle_value slider_handle_value_left">');


};

//////___ViewSlider___////////////////////////////___ViewConfiguration___////////////////////////

OMVC.ViewConfiguration = function () {

};

/////////___ViewConfiguration___///////////////////////////////////___Controller___//////////////

OMVC.Controller = function (model, view, viewConfig) {
  model.sliderElem = $('.slider:eq(0)');
  model.handleElem = $('.slider_handle_left:eq(0)');
  model.valueElem = $('.slider_handle_value_left:eq(0)');

};

////////___Controller___///////////////////////////////////////////___ready___///////////////////




























$(document).ready(function () {
  var model = new OMVC.Model();
  var view = new OMVC.ViewSlider();
  var viewConfig = new OMVC.ViewConfiguration();
  var controller = new OMVC.Controller(model, view, viewConfig);

});