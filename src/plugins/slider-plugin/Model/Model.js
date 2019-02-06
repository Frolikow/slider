import EventEmitter from '../eventEmiter/eventEmiter';
import { validateInitialData, validateIncomingData } from './modelDataValidators';

class Model extends EventEmitter {
  constructor(options) {
    super();

    this.events = ['updateState'];
    this.modelData = validateInitialData(options);
  }

  updateState(newDataToUpdateState) {
    this.modelData = { ...this.modelData, ...validateIncomingData({ ...this.modelData, ...newDataToUpdateState }) };

    this._sendNewDataFromModel();
  }

  _sendNewDataFromModel() {
    this.notify('sendNewDataFromModel', this.modelData);
  }
}

export default Model;
