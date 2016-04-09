module.exports = function(grunt) {

    grunt.initConfig({

        assemble: {
            options: {
                agenda_data: JSON.stringify(grunt.file.readJSON('src/data/agenda.json')),
                flatten: true,
                assets: 'dist/assets',
                partials: ['src/includes/*.hbs'],
                helpers: ['src/helpers/helper-*.js'],
                layout: 'default.hbs',
                layoutdir: 'src/layouts',
                data: ['src/data/*.{json,yml}']
            },
            pages: {
                src: 'src/pages/*.hbs',
                dest: 'dist/'
            },
            popups: {
                options: {
                    layout: 'popup.hbs'
                },
                src: 'src/popups/*.hbs',
                dest: 'dist/'
            }
        },

        babel: {
            options: {
                plugins: ['transform-react-jsx'],
                presets: ['es2015', 'react']
            },
            jsx: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/js/components/',
                    src: ['*.jsx'],
                    dest: '.tmp/jsx-compiled/',
                    ext: '.js'
                }]
            }
        },

        uglify: {
            js: {
                files: {
                    'dist/assets/js/ij.js': [
                        "node_modules/underscore/underscore-min.js",
                        "node_modules/react/dist/react-with-addons.min.js",
                        "node_modules/react-dom/dist/react-dom.min.js",
                        "node_modules/classnames/index.js",
                        "node_modules/react-slider/react-slider.js",
                        "node_modules/jquery/dist/jquery.min.js",
                        "node_modules/jplayer/dist/jplayer/jquery.jplayer.min.js",
                        ".tmp/jsx-compiled/*.js",
                        "src/assets/js/**/*.js"
                    ]
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

        imagemin: {

            images: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.{png,jpeg,jpg,gif}'],
                    dest: 'dist/'
                }]
            }
        },

        copy: {
            jplayer: {
                files: {
                    'dist/assets/flash/jquery.jplayer.swf': 'node_modules/jplayer/dist/jplayer/jquery.jplayer.swf'
                }
            }
        },

        watch: {
            assemble: {
                files: ['src/**/*.hbs'],
                tasks: ['assemble']
            },
            sass: {
                files: ['src/assets/**/*.scss'],
                tasks: ['sass']
            },
            js: {
                files: ['src/assets/**/*.js', '.tmp/jsx-compiled/*.js'],
                tasks: ['uglify']
            },
            jsx: {
                files: ['src/assets/js/components/*.jsx'],
                tasks: ['babel', 'uglify']
            },
            images: {
                files: ['src/assets/img/**/*'],
                tasks: ['imagemin']
            },
            data: {
                files: ['src/data/**/*'],
                tasks: ['assemble']
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
        },

        buildcontrol: {
            options: {
                dir: "dist",
                commit: true,
                push: true,
                message: "Deploy de commit %sourceCommit% en branch %sourceBranch%"
            },
            pages: {
                options: {
                    remote: "git@github.com:iglesiadejesucristo/iglesiadejesucristo.github.io.git",
                    branch: "master"
                }
            }
        }

    });

    grunt.loadNpmTasks("grunt-assemble");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-imagemin");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-browser-sync");
    grunt.loadNpmTasks("grunt-build-control");

    grunt.registerTask('deploy', ["buildcontrol"]);

    grunt.registerTask('build', ["assemble", "sass", "babel", "uglify", "imagemin", "copy"]);

    grunt.registerTask('default', ["build", "browserSync", "watch"]);

};
