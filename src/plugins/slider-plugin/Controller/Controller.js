import EventEmitter from '../eventEmiter/eventEmiter';

class Controller extends EventEmitter {
  constructor() {
    super();
    super.addEmitter(this.constructor.name);
  }

  initPlugin(dataForInitState) {
    this.notify('initSlider');
    this.notify('initPanel');

    this.notify('updateState', dataForInitState);
  }

  sendNewDataFromModel(newData) {
    this.updateSlider(newData);
    this.updatePanel(newData);
  }

  updateSlider(dataSlider) {
    this.notify('updateSlider', dataSlider);
  }

  updatePanel(dataPanel) {
    this.notify('updatePanel', dataPanel);
  }

  updateState(dataForUpdatePlugin) {
    this.notify('updateState', dataForUpdatePlugin);
  }
}

export default Controller;
