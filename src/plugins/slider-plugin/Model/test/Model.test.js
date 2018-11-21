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
const checksIncomingData = jest.spyOn(Model.prototype, '_checksIncomingData');
const calculationRelativePosition = jest.spyOn(Model.prototype, '_calculationRelativePosition');
const calculationValue = jest.spyOn(Model.prototype, '_calculationValue');
const updateViews = jest.spyOn(Model.prototype, 'updateViews');

describe('Тестирование методов Model', () => {
  describe('Тестирование метода updateState', () => {
    test('Метод обновляет глобальные переменные, вызывает приватный метод проверки новых данных и вызывает метод для обновления представлений', () => {
      const mockNewData = {};

      model.updateState(mockNewData);

      expect(checksIncomingData).toHaveBeenCalledTimes(1);
      expect(updateViews).toHaveBeenCalledTimes(1);
    })
  });
  describe('Тестирование метода updateViews', () => {
    const firstRelativePosition = model._calculationRelativePosition(model.modelData.value);
    const secondRelativePosition = model._calculationRelativePosition(model.modelData.valueRange);
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
      model.updateViews();

      expect(calculationRelativePosition).toHaveBeenCalledTimes(2);
      expect(notify).toHaveBeenCalledTimes(2);
      expect(notify).toHaveBeenNthCalledWith(1, 'updateViewSlider', mockDataViewSlider);
      expect(notify).toHaveBeenNthCalledWith(2, 'updateViewPanel', mockDataViewPanel);
    })
  });
  describe('Тестирование метода updateValuesWhenClick', () => {
    test('Метод производит расчеты новых значений при клике по слайдеру и вызывает метод updateViews, для отправки новых значений', () => {
      const mockRelativeCoordinates = 500;
      model.updateViews = jest.fn();

      model.updateValuesWhenClick(mockRelativeCoordinates);

      expect(typeof model.firstRelativePosition).toBe('number')
      expect(typeof model.secondRelativePosition).toBe('number')
      expect(calculationValue).toHaveBeenCalledTimes(1);
      expect(calculationRelativePosition).toHaveBeenCalledTimes(2);
      expect(updateViews).not.toBeCalled();
    })
  });
  describe('Тестирование метода updateValuesWhenMoving', () => {
    test('Метод производит расчеты новых значений при перетаскивании ползунка и вызывает метод updateViews, для отправки новых значений', () => {
      const mockRelativeCoordinates = 500;
      model.updateViews = jest.fn();

      model.updateValuesWhenMoving(mockRelativeCoordinates);

      expect(typeof model.firstRelativePosition).toBe('number')
      expect(typeof model.secondRelativePosition).toBe('number')
      expect(calculationValue).toHaveBeenCalledTimes(1);
      expect(calculationRelativePosition).toHaveBeenCalledTimes(2);
      expect(updateViews).not.toBeCalled();
    })
  });
});
