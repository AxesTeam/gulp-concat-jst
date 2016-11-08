'use strict';

var gutil = require('gulp-util');
var fs = require('graceful-fs');
var map = require('map-stream');
var _ = require("lodash");

module.exports = function(options) {
    options = _.extend({
        separator_start: '',
        separator_end: '',
        jst_path: 'tmp/template/',
        jst_ext: ".jst",
        pattern: /CustomGetTemplateFn\s*\(\'(.*?).html\'\)/g,
        replace_text: "$1",
        replace: null
    }, options);
    return map(function (file, cb) {
      if (file.isNull()) {
          console.log("null");
          return callback(null, file);
      }
      if (file.isStream()) {
          console.log("stream");
          return callback(null, file);
      }

      if (file.isBuffer()) {
          var js_source = fs.readFileSync(file.path,  { encoding : 'UTF-8'});
          //通过正则找出所有的 GetTemplate() 方法，得到模版文件列表
          var myregexp = options.pattern;
          var group = js_source.match(myregexp);
          if (group) {
              var output = "";
              var arr = {};
              for (var i = 0; i < group.length; i++) {
                  var file_name = group[i].replace(myregexp, options.replace_text);
                  //当前JS文件中，此模版还未被合并
                  if (!arr[file_name]) {
                      //标识此模版已经合并
                      arr[file_name] = true;
                      var jst = fs.readFileSync(options.jst_path + file_name + options.jst_ext, { encoding : 'UTF-8'});
                      // 这个jst的组件最后没有加上分号，这边要手动加下，免得后面合并的时候，有语法错误
                      jst += ";";
                      //运行自定义替换函数
                      if (options.replace) {
                          jst = options.replace(jst, file_name);
                      }
                      output = output + jst;
                  }
              }
              js_source = `${options.separator_start}${output}${options.separator_end}${js_source}`;
              console.log(gutil.colors.green(`File ${file.path} contact jst.`));
              file.contents = new Buffer(js_source);
              cb(null, file);
          }else{
              return cb(null, file);
          }
      }
    });
};
