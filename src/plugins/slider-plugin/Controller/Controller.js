import EventEmitter from '../eventEmiter/eventEmiter';

class Controller extends EventEmitter {
  constructor() {
    super();

    this.events = ['sendNewDataFromModel', 'updateState'];
  }

  initPlugin() {
    this.notify('initSlider');
    this.notify('initPanel');

    this.notify('updateState');
  }

  sendNewDataFromModel(newData) {
    this._updateSlider(newData);
    this._updatePanel(newData);
  }

  _updateSlider(dataSlider) {
    this.notify('updateSlider', dataSlider);
  }

  _updatePanel(dataPanel) {
    this.notify('updatePanel', dataPanel);
  }

  updateState(dataForUpdatePlugin) {
    this.notify('updateState', dataForUpdatePlugin);
  }
}

export default Controller;
