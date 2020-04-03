const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const prettyData = require('gulp-pretty-data');
const distPath = __dirname + '/dist';
const through2 = require('through2');

const copyFiles = () => {
  return  gulp.src(['src/**/**.js', 'src/**/**.json', 'src/**/**.wxml', 'src/**/**.wxss', 'src/**/**.png'])
  .pipe(gulp.dest(distPath));
}
const copyLess = () => {
  return gulp.src('src/**/**.less')
    .pipe(less())
    .pipe(through2.obj(function (file, _, cb) {
      if (file.isBuffer()) {
        const code = file.contents.toString();
        file.contents = Buffer.from(code.replace(/(\d+)px/g, function (allCode, number) {
          return (+number) / 50 + 'rem';
        }))
      }
      cb(null, file);
    }))
    .pipe(rename(file => {
      file.extname = '.wxss';
    }))
    .pipe(gulp.dest(distPath));
}

gulp.task('minify',  function (done) {
  // copyFiles();
  // copyLess();
  // 压缩wxml
  gulp.src('dist/**/*.wxml')
    .pipe(htmlmin({
        removeComments: true, // 清除swan注释
        collapseWhitespace: true, // 压缩swan
        keepClosingSlash: true
    }))
    .pipe(gulp.dest('dist'));

  // 压缩json、css 
  gulp.src('dist/**/*.{json,wxss}')
    .pipe(prettyData({
      type: 'minify',
      preserveComments: false, //清除css注释
      extensions: {
        'wxss': 'css'
      }
    }))
    .pipe(gulp.dest('dist'))
  done()
})
