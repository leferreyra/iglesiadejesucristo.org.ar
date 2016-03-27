module.exports = function(grunt) {

    grunt.initConfig({

        assemble: {
            options: {
                flatten: true,
                assets: 'dist/assets',
                partials: ['src/includes/*.hbs'],
                helpers: ['src/helpers/helper-*.js'],
                layout: 'src/layouts/default.hbs',
                data: ['src/data/*.{json,yml}']
            },
            pages: {
                src: 'src/pages/*.hbs',
                dest: 'dist/'
            }
        },

        uglify: {
            js: {
                files: {
                    'dist/assets/js/ij.js': ["src/assets/js/**/*.js"]
                }
            }
        },

        sass: {
            dist: {
                files: {
                    'dist/assets/css/ij.css': 'src/assets/styles/main.scss'
                }
            }
        },

        watch: {
            assemble: {
                files: ['src/**/*.hbs'],
                tasks: ['build']
            },
            sass: {
                files: ['src/assets/**/*.scss'],
                tasks: ['sass']
            },
            js: {
                files: ['src/assets/**/*.js'],
                tasks: ['uglify']
            }
        },

        browserSync: {
            options: {
                watchTask: true,
                server: {
                    baseDir: "dist"
                }
            },
            bsFiles: {
                src: "dist/**/*"
            }
        }

    });

    grunt.loadNpmTasks("grunt-assemble");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-browser-sync");

    grunt.registerTask('build', ["assemble", "sass", "uglify"]);
    grunt.registerTask('default', ["build", "browserSync", "watch"]);

};
