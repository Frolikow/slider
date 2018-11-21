import ViewPanel from '../ViewPanel';

document.body.innerHTML = '<div class="slider"></div>'
const $ = require('jquery');

const mockOptions = {}
mockOptions.slider = $('.slider');

const viewPanel = new ViewPanel(mockOptions);

const createPanel = jest.spyOn(ViewPanel.prototype, '_createPanel');
const eventListeners = jest.spyOn(ViewPanel.prototype, '_eventListeners');
const initAttributes = jest.spyOn(ViewPanel.prototype, '_initAttributes');

describe('Тестирование методов viewPanel', () => {
  describe('Тестирование метода updateViewPanel', () => {
    describe('Метод, в зависимости от полученного значения "visibilityConfigPanel", создает панель или нет.', () => {
      const mockData = { minimum: 1, maximum: 10, value: 5, valueRange: 8, step: 1 };
      test('При "visibilityConfigPanel === true" вызвает приватные методы по 1 разу и отрисовывает панель', () => {
        viewPanel.visibilityConfigPanel = true;

        viewPanel.updateViewPanel(mockData);

        expect(createPanel).toHaveBeenCalledTimes(1);
        expect(eventListeners).toHaveBeenCalledTimes(1);
        expect(initAttributes).toHaveBeenCalledTimes(1);
      })

      afterEach(() => {
        createPanel.mockRestore();
        eventListeners.mockRestore();
        initAttributes.mockRestore();
      })
      test('При "visibilityConfigPanel === false" не вызвает приватные методы ни разу и не отрисовывает панель', () => {
        viewPanel.visibilityConfigPanel = true;

        viewPanel.updateViewPanel(mockData);

        expect(createPanel).not.toBeCalled();
        expect(eventListeners).not.toBeCalled();
        expect(initAttributes).not.toBeCalled();
      });
    })
  });
});
