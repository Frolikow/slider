# Slider (Третий проект).  
jQuery плагин - слайдер.  

Для скачивания проекта выполнить в нужном каталоге команду:  
* `git clone https://github.com/Frolikow/slider.git`  

 Проект на _GitHub_ _Pages_:  
* [Третий проект](https://frolikow.github.io/slider/)  

## Содержание проекта:  
* [src](#src)   
* [.eslintignore](#eslintignore)   
* [eslintrc](#eslintrc)  
* [.gitignore](#gitignore)  
* [npm-shrinkwrap](#npm-shrinkwrapjson)
* [package.json](#packagejson)
* [webpack.config.js](#webpackconfigjs)  


### src   
Папка содержащая файлы базовых стилей и разметки, файл точки входа для сборщика и файлы плагина.  
 * [plugins](#plugins)  
 * [slider](#slider)  
 * [app.js](#appjs)  
 * [base.styl](#basestyl)  
 * [index.pug](#indexpug)  
  #### plugins  
  
  #### slider   
  * Файл содержащий вызов плагина. Вызов слайдера имеет вид:  
```
  $(document).ready(() => {
    $('ваш_блок_в котором_отрисовывается_слайдер').each(function () {
      $(this).efSlider({
        sliderConfigPanel: true,
        sliderMin: 1,
        sliderMax: 5,
        sliderValue: 2,
        sliderValueRange: 3,
        sliderStep: 1,
        sliderHandleValueHide: false,
        verticalOrientation: false,
        sliderRangeStatus: false,
        });
      });
    });  
```
Слайдер вызывается после полной загрузки документа. Вызывается на каждом переданном блоке (если их >1 на странице). Внутри вызова передаются опции объектом (наличие опций и порядок не имеет значение).
Описание опций:  
  > sliderConfigPanel
  >>  Отображение панели конфигураций слайдера. true- показать панель, false- скрыть.  

  > sliderMin
  >> Минимальное значение слайдера. Принимает число. 

  > sliderMax
  >> Максимальное значение слайдера. Принимает число.

  > sliderValue
  >>  Текущее значение ползунка. Принимает число.

  > sliderValueRange
  >>  Текущее значение второго ползунка. Принимает число.

  > sliderStep
  >> Значение определяющее шаг слайдера. Принимает число >= 1.

  > sliderHandleValueHide
  >> Опция отображения ярлыка со значением над ползунком. Принимает true/false. true- скрыть ярлык, false- отображать ярлык.

  > verticalOrientation
  >> Включение вертикальной ориентации слайдера. Принимает true/false. true- вкл. вертикальной ориентации, false- выкл. вертикальной ориентации.

  > sliderRangeStatus
  >> Включение второго ползунка (для выбора интервала). Принимает true/false. true- показать ползунок, false- скрыть ползунок.  
   
   По умолчанию у опций следующие значения:  
   ```
      sliderConfigPanel = false;
      sliderMin = 1;
      sliderMax = 10;
      sliderValue = sliderMin;
      sliderValueRange = sliderMax;
      sliderStep = 1;
      verticalOrientation = false;
      sliderRangeStatus = false;
      sliderHandleValueHide = false;
  ```
  #### app.js  
  * Файл в котором импортируются все js-файлы,плагины и стили.  

  #### base.styl  
  * Файл со стилями для плагина  

  #### index.pug  
  * Основной файл для DOM- элементов.

### .eslintignore   
* Список файлов игнорируемых Eslint.  

### eslintrc  
* Правила для Eslint.  

### .gitignore  
* Правила игнорирования для Git. Игнорируются папки:  
`/.vscode`  
`/node_modules`  
`/public`  

### npm-shrinkwrap  
* Список точных версий установленных пакетов, с которыми проект работает 100%.   

### package.json  
* Информация о проекте: Имя проекта, автор, версия, используемые пакеты, скрипты для запуска сборщика и пр.  
* Скрипты для сборщика: 

  > Название скрипта  
  >> Значение скрипта  
  >>> Функция скрипта   
  -----------------
  > start  
  >> webpack-dev-server --env development  
  >>> Запуск дев-сервера для разработки  

  > build  
  >> ./node_modules/.bin/webpack --env production  
  >>> Запуск сборки проекта в папку public 
   
  > deploy  
  >> gh-pages -d public/UIkit  
  >>> Публикация проекта на GitHub Pages(выполнять после скрипта "build")  

* Использовать скрипты в командной строке проекта командой:  
  `npm run [Название скрипта]`  

### webpack.config.js  
* Конфигурация сборщика WebPack.  
* Описание точки входа для сборщика, выходные файлы, используемые лоадеры и плагины.  