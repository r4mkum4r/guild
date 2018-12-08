/**
 * `clean`
 *
 * ---------------------------------------------------------------
 *
 * Automatically sync changes to all devices when assets are saved and compiled
 *
 * For usage docs see:
 *   https://www.browsersync.io/
 *   https://www.browsersync.io/docs/grunt
 *
 */
 module.exports = function (grunt) {

   grunt.config.set('browserSync', {
     dev: {
       bsFiles: {
         src: '.tmp/**/*'
       },
       options: {
         // When your app also uses web sockets
         // NOTE: requires 2.8.1 or above
         port: '1337',
         proxy: {
           target: 'http://localhost:1337',
           ws: true
         },
         watchTask: true,
         reloadOnRestart: true
       }
     }
   });

   grunt.loadNpmTasks('grunt-browser-sync');
 };
