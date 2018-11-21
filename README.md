# Slider (Третий проект).  
jQuery плагин - слайдер.  

Для скачивания проекта выполнить в нужном каталоге команду:  
* `git clone https://github.com/Frolikow/slider.git`  

 Проект на _GitHub_ _Pages_:  
* [Третий проект](https://frolikow.github.io/slider/)  

  > start  
  >> webpack-dev-server --env development  
  >>> Запуск дев-сервера для разработки  

  > build  
  >> ./node_modules/.bin/webpack --env production  
  >>> Запуск сборки проекта в папку public 
   
  > deploy  
  >> gh-pages -d public/UIkit  
  >>> Публикация проекта на GitHub Pages(выполнять после скрипта "build")  

  > test  
  >> ./node_modules/.bin/jest  
  >>> Запуск тестов

  > test-coverage  
  >> ./node_modules/.bin/jest --coverage  
  >>> Запуск тестов (с показом покрытия кода тестами)

* Использовать скрипты в командной строке проекта командой:  
  `npm run [Название скрипта]`  
