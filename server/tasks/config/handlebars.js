// tasks/config/handlebars.js
// --------------------------------
// handlebar task configuration.

module.exports = function(grunt) {

    // We use the grunt.config api's set method to configure an
    // object to the defined string. In this case the task
    // 'handlebars' will be configured based on the object below.
    grunt.config.set('handlebars', {
        dev: {
            options: {
                namespace: 'Handlebars.templates',
                partialsUseNamespace: false,
                processName: function(filePath) {  // input: templates/_header.hbs
                    return filePath.replace('assets/templates/', '').replace('.handlebars', '');       // output: _header.hbs
                }
            },
            // We will define which template files to inject
            // in tasks/pipeline.js
            files: {
                '.tmp/public/templates.js': require('../pipeline').templateFilesToInject
            }
        }
    });

    // load npm module for handlebars.
    grunt.loadNpmTasks('grunt-contrib-handlebars');
};
