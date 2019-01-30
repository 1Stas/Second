var gulp       = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'),	// Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'),	// Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'),	// Подключаем библиотеку для работы с изображениями. Если выдает ошибку не найден imagemin, устанавливаем по второй команде.
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'); // Подключаем библиотеку для автоматического добавления префиксов


// Конвертиция Sass в css + автопрефиксер
gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.sass') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

//Релоад браузера
gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync.init({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

//Библиотеки JQuery и Magnific Popup
gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
			'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
			'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
			])
			.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
			.pipe(uglify()) // Сжимаем JS файл
			.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});


gulp.task('css-libs', ['sass'], function() {
//	setTimeout(function(){gulp.start('sass');},1500) // Задача выполниться через 500 миллисекунд и файл успеет сохраниться на диске 
    return gulp.src('app/css/libs.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

//Наблюдение за файлами
// gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() { // Строка изменена
gulp.task('watch', ['browser-sync'], function() {
		gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
		gulp.watch('app/css/*.css', browserSync.reload); // Наблюдение за css 
});

//Чистим папку dist
gulp.task('clean', function() {
		return del.sync('dist'); // Удаляем папку dist перед сборкой
});

//Сжатие картинок
gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

// Выгрузка в dist
gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))
    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

// Очистка кеша
gulp.task('clear', function () {
    return cache.clearAll();
})

//Замена gulp watch на gulp
gulp.task('default', ['watch']);



// Для запуска gulp необходимо:
// Скачать версию Node.js для своей системы https://nodejs.org/en/download/
// Открываем командную строку, для Windows удерживаем Shift + правой кнопкой мыши в проводнике
// там где находится ваш проект, допустим E:\MyProject. 
// Общая тсруктура для проектов 
// MyProject/
//   app/
//     css/
//     fonts/
//     img/
//     js/
//     sass/
//     index.html
//   dist/
//   node_modules/  (создается автоматически)
//   gulpfile.js    (создаем сами)
//   package.json   (авто)
//
// Открывать ком строку лучше именно в обычном проводнике, пробовал через Total Commsnder не пошло
// Вводим   npm i gulp -g
// Для пользователей Mac и Linux, возможно, придется выполнять команды с правами суперпользователя, sudo.
// Так же в папке проекта вводим npm init
// В строках name можно ввести название MyProject, далее пропускаем до Is this ok? вводим yes
// В папке myproject нарисуется новый файл package.json.
// Ставим Gulp в ком строку npm i gulp --save-dev
// Появляется папка node_modules
// В ком строку npm i gulp-sass --save-dev ставим sass
// npm i browser-sync --save-dev автообновление браузера
// В ком строке gulp watch должен выдать что то типа Starting browser-sync after 96ms, тоже с sass, все работает
// Остановить процесс Ctrl+c Y
// Оптимизация JavaScript
// Создаем в app папку libs 
// Устанавливаем GIT https://git-scm.com/downloads
// Ставим Bower: npm i -g bower
// В корне создаем файл .bowerrc винда не дает создать с точкой, нужен файловый менеджер
// В него пишем {"directory" : "app/libs/"} место куда пойдут дополнения бовер
// Ком строка bower i jquery magnific-popup
// Создаем таск scripts, собирает все js файлы в один
// Ком строка npm i --save-dev gulp-concat gulp-uglifyjs
// Проверяем работу Ком строка gulp scripts
// Пример подключения css библиотек, у нас только одна Магнифик попап
// Создаем sass/libs.sass
// В нем @import "app/libs/magnific-popup/dist/magnific-popup.css" // Импортируем библиотеку Magnific Popap
// Внимание! В новых версиях gulp-sass для импорта CSS файлов в Sass необходимо указывать расширение .css
// В папке app/css мы создаем дополнительно к main.css файл libs.css
// Для минификации CSS установим пакеты gulp-cssnano и gulp-rename
// npm i gulp-cssnano gulp-rename --save-dev
// Вкл gulp watch должно заканчиваться на http и Serving files from: app
// В папке app/css появится libs.min.css
// Подготовка к продакшену 
// Чистильщик папки dist В ком строке npm i del --save-dev
// Оптимизация изображений
// npm i gulp-imagemin imagemin-pngquant --save-dev или npm install --save-dev gulp-imagemin Вторая команда исправила ошибку отсутствия imagemin
// Для обработки большого количества изображений необходимо их кешироавать
// npm i gulp-cache --save-dev
// Автопрефикс    npm i --save-dev gulp-autoprefixer
// Итак у нас 2 главных таска gulp watch и gulp build 
// Чтобы постоянно не писать gw повесим его на деолтный таск gulp
// И для очистки кеша gulp создадим gulp clear
// Если у вас возникнут проблемы с кешируемыми файлами, почистите кеш

// Команды установки:
// Ставим Node.js
// Открыть консоль шифт + пкм в корне проекта
// npm i gulp -g
// npm init пишем имя проекта
// npm i gulp --save-dev
// npm i gulp-sass --save-dev
// npm i browser-sync --save-dev
// npm i -g bower
// bower i jquery magnific-popup
// npm i --save-dev gulp-concat gulp-uglifyjs
// npm i gulp-cssnano gulp-rename --save-dev
// npm i del --save-dev
// npm i gulp-imagemin imagemin-pngquant --save-dev или npm install --save-dev gulp-imagemin
// npm i gulp-cache --save-dev
// npm i --save-dev gulp-autoprefixer
