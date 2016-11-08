# gulp-jst-concat

> concat jst file to module's js file for gulp

## Getting Started

```shell
npm install gulp-jst-concat --save-dev
```

### Usage Examples

```js
gulp.task('jst-concat', function(){
    return gulp.src("fixtures/modules/*.js")
        .pipe(jst_concat({
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
```

### Options

#### options.separator_start
Type: `String`
Default value: `''`

A string value that is used to do something with whatever.

#### options.separator_end
Type: `String`
Default value: `''`

A string value that is used to do something with whatever.

#### options.jst_path
Type: `String`
Default value: `'tmp/template/'`

compiled jst template path

#### options.jst_ext
Type: `String`
Default value: `'.jst'`

jst template extension

#### options.pattern
Type: `String`
Default value: `'/CustomGetTemplateFn\s*\(\'(.*?).html\'\)/g'`

A regex pattern that is used to get template path list

#### options.replace_text
Type: `String`
Default value: `'$1'`

A string value that is used to replace template name

#### options.replace
Type: `Function`
Default value: `null`

A function that is used to do something you want.

