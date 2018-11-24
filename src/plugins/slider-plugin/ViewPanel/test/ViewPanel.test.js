import ViewPanel from '../ViewPanel';

document.body.innerHTML = '<div class="slider"></div>'
const $ = require('jquery');

const mockOptions = {}
mockOptions.slider = $('.slider');

const viewPanel = new ViewPanel(mockOptions);

const createPanelElement = jest.spyOn(ViewPanel.prototype, '_createPanelElement');
const eventHandlers = jest.spyOn(ViewPanel.prototype, '_eventHandlers');
const initializeElementsAttributes = jest.spyOn(ViewPanel.prototype, '_initializeElementsAttributes');

describe('Тестирование методов viewPanel', () => {
  describe('Тестирование метода updateViewPanel', () => {
    describe('Метод, в зависимости от полученного значения "visibilityConfigPanel", создает панель или нет.', () => {
      const mockData = { minimum: 1, maximum: 10, value: 5, valueRange: 8, step: 1 };
      test('При "visibilityConfigPanel === true" вызвает приватные методы по 1 разу и отрисовывает панель', () => {
        viewPanel.visibilityConfigPanel = true;

        viewPanel.updateViewPanel(mockData);

        expect(createPanelElement).toHaveBeenCalledTimes(1);
        expect(eventHandlers).toHaveBeenCalledTimes(1);
        expect(initializeElementsAttributes).toHaveBeenCalledTimes(1);
      })

      afterEach(() => {
        createPanelElement.mockRestore();
        eventHandlers.mockRestore();
        initializeElementsAttributes.mockRestore();
      })
      test('При "visibilityConfigPanel === false" не вызвает приватные методы ни разу и не отрисовывает панель', () => {
        viewPanel.visibilityConfigPanel = true;

        viewPanel.updateViewPanel(mockData);

        expect(createPanelElement).not.toBeCalled();
        expect(eventHandlers).not.toBeCalled();
        expect(initializeElementsAttributes).not.toBeCalled();
      });
    })
  });
});
