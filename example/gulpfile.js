var gulp  = require('gulp');
var concat_jst  = require('../index');
var del    = require('del');
var seq = require("gulp-sequence");
var jst = require("gulp-jst");

gulp.task('clean', function(cb) {
    return del(['build'], cb);
});

gulp.task('jst', function(){
    return gulp.src("fixtures/template/*.html")
        .pipe(jst())
        .pipe(gulp.dest("build/template"))
});

gulp.task('concat_jst', function(){
    return gulp.src("fixtures/modules/*.js")
        .pipe(concat_jst({
            separator_start: '/**start**/',
            separator_end: '/**end**/',
            jst_path: 'build/template/',
            jst_ext: ".js",
            pattern: /CustomGetTemplateFn\s*\(\'(.*?).html\'\)/g,
            replace: function(jst, tmpFile){
                return `this["ajst"] = this["ajst"] || {};this["ajst"]["${tmpFile}"] = ${jst}`;
            }
        }))
        .pipe(gulp.dest("build/modules"))
});


gulp.task('default', seq("clean", "jst", "concat_jst"));