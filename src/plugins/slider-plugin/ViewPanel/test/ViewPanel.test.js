import ViewPanel from '../ViewPanel';

document.body.innerHTML = '<div class="slider"></div>'
const $ = require('jquery');

const viewPanel = new ViewPanel($('.slider'), true);

const createPanelElement = jest.spyOn(ViewPanel.prototype, '_createPanelElement');
const initEventListeners = jest.spyOn(ViewPanel.prototype, '_initEventListeners');

const setVisibilityOfSecondCurrentValue = jest.spyOn(ViewPanel.prototype, '_setVisibilityOfSecondCurrentValue');
const updatePanelElements = jest.spyOn(ViewPanel.prototype, '_updatePanelElements');


describe('Тестирование методов viewPanel', () => {

  describe('Тестирование метода initPanel', () => {

    describe('Метод, в зависимости от полученного значения "isConfigPanelVisible", создает панель или нет.', () => {
      test('При "isConfigPanelVisible === true" вызвает приватные методы по 1 разу и отрисовывает панель', () => {
        viewPanel.isConfigPanelVisible = true;

        viewPanel.initPanel();

        expect(createPanelElement).toHaveBeenCalledTimes(1);
        expect(initEventListeners).toHaveBeenCalledTimes(1);
      })

      afterEach(() => {
        createPanelElement.mockRestore();
        initEventListeners.mockRestore();
      })

      test('При "isConfigPanelVisible === false" не вызывает приватные методы ни разу и не отрисовывает панель', () => {
        viewPanel.isConfigPanelVisible = false;

        viewPanel.initPanel();

        expect(createPanelElement).not.toBeCalled();
        expect(initEventListeners).not.toBeCalled();
      });
    })
  });
  describe('Тестирование метода updatePanel', () => {

    describe('Метод обновляет свойства панели, видимость $currentValueSecondHandle и атрибуты элементов панели.', () => {
      test('Обновление панели конфигурации', () => {
        const mockData = {
          firstValue: 4,
          secondValue: 8,
          minimum: 1,
          maximum: 10,
          step: 1,
          areTooltipsVisible: false,
          isVerticalOrientation: false,
          hasIntervalSelection: true,
        }

        viewPanel.updatePanel(mockData);

        expect(setVisibilityOfSecondCurrentValue).toBeCalledWith(viewPanel.hasIntervalSelection);
        expect(setVisibilityOfSecondCurrentValue).toHaveBeenCalledTimes(1);
        
        expect(updatePanelElements).toHaveBeenCalledTimes(1);
      })
    })
  });
});
