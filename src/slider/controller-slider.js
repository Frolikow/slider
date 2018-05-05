

var Controller = function (view, model) {
  var _view = view;
  var _model = model;

  // event binding
  $('body').bind('addItem', function (e) {
    _model.addTodo(e.todo);
  });
  $('body').bind('deleteItem', function (e) {
    _model.deleteTodo(e.index);
  });
  $('body').bind('updateView', function (e) {
    _view.updateView(_model.getData());
  });
};

//init
