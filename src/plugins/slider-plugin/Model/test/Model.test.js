import Model from '../Model';
import EventEmmiter from '../../eventEmiter/eventEmiter';

const mockOptions = {
  minimum: 1,
  maximum: 10,
  value: 5,
  valueRange: 8,
  step: 1,
  rangeStatus: true,
  visibilityTooltips: true,
  verticalOrientation: true,
};
const model = new Model(mockOptions);

const notify = jest.spyOn(EventEmmiter.prototype, 'notify');
const checkIncomingData = jest.spyOn(Model.prototype, '_checkIncomingData');
const calculateRelativePosition = jest.spyOn(Model.prototype, '_calculateRelativePosition');
const calculateTheValueForTheHandle = jest.spyOn(Model.prototype, '_calculateTheValueForTheHandle');
const sendNewDataFromModel = jest.spyOn(Model.prototype, 'sendNewDataFromModel');

describe('Тестирование методов Model', () => {
  describe('Тестирование метода updateState', () => {
    test('Метод обновляет глобальные переменные, вызывает приватный метод проверки новых данных и вызывает метод для обновления представлений', () => {
      const mockNewData = {};

      model.updateState(mockNewData);

      expect(checkIncomingData).toHaveBeenCalledTimes(1);
      expect(sendNewDataFromModel).toHaveBeenCalledTimes(1);
    })
  });
  describe('Тестирование метода sendNewDataFromModel', () => {
    const firstRelativePosition = model._calculateRelativePosition(model.modelData.value);
    const secondRelativePosition = model._calculateRelativePosition(model.modelData.valueRange);
    test('Метод считает новые (относительные) координаты ползунков и значения слайдера, формирует объекты для представлений и отправляет посредством метода notify', () => {
      const mockDataViewSlider = {
        value: model.modelData.value,
        valueRange: model.modelData.valueRange,
        firstRelativePosition,
        secondRelativePosition,
        rangeStatus: model.modelData.rangeStatus,
        visibilityTooltips: model.modelData.visibilityTooltips,
        verticalOrientation: model.modelData.verticalOrientation,
      };
      const mockDataViewPanel = {
        value: model.modelData.value,
        valueRange: model.modelData.valueRange,
        minimum: model.modelData.minimum,
        maximum: model.modelData.maximum,
        step: model.modelData.step,
      };
      model.sendNewDataFromModel();

      expect(calculateRelativePosition).toHaveBeenCalledTimes(2);
      expect(notify).toHaveBeenCalledTimes(1);
      expect(notify).toHaveBeenCalledWith('sendNewDataFromModel', { dataForSlider: mockDataViewSlider, dataForPanel: mockDataViewPanel });
    })
  });
  describe('Тестирование метода updateValuesForStaticCoordinates', () => {
    test('Метод производит расчеты новых значений при клике по слайдеру и вызывает метод sendNewDataFromModel, для отправки новых значений', () => {
      const mockRelativeCoordinates = 500;
      model.sendNewDataFromModel = jest.fn();

      model.updateValuesForStaticCoordinates(mockRelativeCoordinates);

      expect(typeof model.firstRelativePosition).toBe('number')
      expect(typeof model.secondRelativePosition).toBe('number')
      expect(calculateTheValueForTheHandle).toHaveBeenCalledTimes(1);
      expect(calculateRelativePosition).toHaveBeenCalledTimes(2);
      expect(sendNewDataFromModel).not.toBeCalled();
    })
  });
  describe('Тестирование метода updateValuesForDynamicCoordinates', () => {
    test('Метод производит расчеты новых значений при перетаскивании ползунка и вызывает метод sendNewDataFromModel, для отправки новых значений', () => {
      const mockRelativeCoordinates = 500;
      model.sendNewDataFromModel = jest.fn();

      model.updateValuesForDynamicCoordinates(mockRelativeCoordinates);

      expect(typeof model.firstRelativePosition).toBe('number')
      expect(typeof model.secondRelativePosition).toBe('number')
      expect(calculateTheValueForTheHandle).toHaveBeenCalledTimes(1);
      expect(calculateRelativePosition).toHaveBeenCalledTimes(2);
      expect(sendNewDataFromModel).not.toBeCalled();
    })
  });
});
