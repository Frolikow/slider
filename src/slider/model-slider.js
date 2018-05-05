'use strict';

var Model = function () {
  var _todos = new Array();

  var notifyController = function () {
    $('body').trigger('updateView');
  }
  // public methods
  return {
    addTodo: function (todo) {
      _todos.push(todo);
      notifyController();
    },
    editTodo: function (index, newTodo) {
      _todos[index] = newTodo;
    },
    deleteTodo: function (index) {
      _todos.splice(index, 1);
      notifyController();
    },
    getData: function () {
      return _todos;
    }
  };
};