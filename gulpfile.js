// From https://gist.github.com/webdesserts/5632955

var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;

gulp.task('run', function() {
      if (node) node.kill();
      node = spawn('node', ['app.js'], {stdio: 'inherit'});
      node.on('close', function (code) {
        if (code === 8) {
          gulp.log('Error detected, waiting for changes...');
        }
      });
});

gulp.task('debug', function() {
      if (node) node.kill();
      node = spawn('node', ['--inspect-brk', 'app.js'], {stdio: 'inherit'});
      node.on('close', function (code) {
        if (code === 8) {
          gulp.log('Error detected, waiting for changes...');
        }
      });
});

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', ['run'], function() {
  gulp.watch(['./app.js', './lib/**/*.js'], ['run'], function() {
      console.log("Files changed...restarting server");
  });
});

gulp.task('server-debug', ['debug'], function() {
  gulp.watch(['./app.js', './lib/**/*.js'], ['debug'], function() {
      console.log("Files changed...restarting server");
  });
});

gulp.task('default', ['server']);

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill();
});
