'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    clean: {
      dist: ['.tmp', '<%= yeoman.dist %>/*'],
      server: '.tmp'
    },
    copy: {
      tmp: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '.tmp',
          src: [
            'bower_components/**'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            'elements/**',
            '!elements/**/*.html',
            '!elements/**/*.css',
            '!elements/**/*.js',
            '!elements/**/*.{png,jpg,jpeg}',
            'bower_components/platform/platform.js'
          ]
        }]
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/elements',
          src: '**/*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/elements'
        }]
      }
    },
    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/elements',
          src: '**/*.js',
          dest: '.tmp/elements'
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      default: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['**/*.css', '!bower_components/**/*.css'],
          dest: '.tmp'
        }]
      }
    },
    cssmin: {
      main: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: '*.css',
          dest: '.tmp'
        }]
      },
      elements: {
        files: [{
          expand: true,
          cwd: '.tmp/elements',
          src: '**/*.css',
          dest: '.tmp/elements'
        }]
      }
    },
    minifyHtml: {
      options: {
        quotes: true,
        empty: true
      },
      main: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '.tmp'
        }]
      },
      elements: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/elements',
          src: '**/*.html',
          dest: '.tmp/elements'
        }]
      }
    },
    inline: {
      dist: {
        options: {
          tag: '.css'
        },
        src: ['.tmp/index.html'],
        dest: ['<%= yeoman.dist %>/']
      }
    },
    vulcanize: {
      dist: {
        options: {
          inline: true,
          strip: true
        },
        files: {
          '<%= yeoman.dist %>/elements/elements.html': [
            '.tmp/elements/elements.html'
          ]
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: { liveCSS: false }
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= yeoman.app %>/*.html',
          '<%= yeoman.app %>/elements/{,*/}*.html',
          '<%= yeoman.app %>/elements/{,*/}*.js',
          '{.tmp,<%= yeoman.app %>}/elements/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
        ]
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint']
      },
      styles: {
        files: [
          '<%= yeoman.app %>/elements/{,*/}*.css'
        ],
        tasks: ['autoprefixer']
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= yeoman.app %>/elements/{,*/}*.js'
      ]
    }
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'autoprefixer',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'copy',
    'imagemin',
    'uglify',
    'autoprefixer',
    'cssmin',
    'minifyHtml',
    'inline',
    'vulcanize'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
