/**
 * Look at this and smile :)
 *
 * @author: Haithem Bel Haj
 */


module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take
  require('time-grunt')(grunt);

  // default configs
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    paths: {
      src: './app',
      dest: './public'
    },
    host: 'localhost:3000'
  });

  // browserify for es6
  grunt.config('browserify', {

    dev: {

      options: {
        transform: ['babelify']
      },
      files: [
        {
          src: '<%= paths.src %>/scripts/main.js',
          dest: '<%= paths.dest %>/scripts/main.js'
        }
      ]
    },
    build: {

      options: {
        transform: ['babelify', ['uglifyify', {global: true}]]
      },

      files: [
        {
          src: '<%= paths.src %>/scripts/main.js',
          dest: '<%= paths.dest %>/scripts/main.js'
        }
      ]
    }
  });

  // sass for scss
  grunt.config('sass', {

    options: {

      importer: [require('compass-importer')],
      functions: {

        svg: require('sass-inline-svg')('<%= apths.src%>/assets/svgs')
      }
    },

    dev: {

      options: {

        outputStyle: 'extended'
      },
      files: [{

        expand: true,
        cwd: '<%= paths.src %>/styles',
        dest: '<%= paths.dest %>/styles',
        src: ['**/*.scss'],
        ext: '.css'
      }]
    },
    build: {

      options: {

        outputStyle: 'compressed'
      },
      files: [{

        expand: true,
        cwd: '<%= paths.src %>/styles',
        dest: '<%= paths.dest %>/styles',
        src: ['**/*.scss'],
        ext: '.css'
      }]
    }
  });

  grunt.config('postcss', {
    dev: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({
            browsers: 'last 3 version'
          })
        ]
      },
      src: '<%= paths.dest %>/styles/*.css'
    },
    build: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({
            browsers: 'last 3 version'
          })
        ]
      },
      src: '<%= paths.dest %>/styles/*.css'
    }
  });

  // browserSync
  grunt.config('browserSync', {
    dev: {

      bsFiles: {
        src: [

          '<%= paths.dest %>/scripts/*.js',
          '<%= paths.dest %>/styles/*.css'
        ]
      },
      options: {
        port: 3010,
        watchTask: true,
        notify: false,
        proxy: {
          target: '<%= host%>'
        },
        ghostMode: false
      }
    }
  });

  // watch me if you can
  grunt.config('watch', {

    scripts: {
      files: [
        '<%= paths.src %>/scripts/**/*.js',
        '<%= paths.src %>/components/**/*.js',
        '<%= paths.src %>/modules/**/*.js',
        '<%= paths.src %>/atoms/**/*.js'
      ],
      tasks: ['scripts:dev']
    },

    styles: {
      files: [
        '<%= paths.src %>/styles/**/*.scss',
        '<%= paths.src %>/components/**/*.scss',
        '<%= paths.src %>/modules/**/*.scss',
        '<%= paths.src %>/atoms/**/*.scss'
      ],
      tasks: ['styles:dev']
    }
  });

  // eslint
  grunt.config('eslint', {

    target:  grunt.config('watch').scripts.files
  });

  // scss lint
  grunt.config('scsslint', {

    allFiles:  grunt.config('watch').styles.files,
    options: {
      config: '.scss-lint.yml',
      colorizeOutput: true
    },
  });

  // default
  grunt.registerTask('default', ['dev']);

  //styles
  grunt.task.registerTask('styles', 'BuildStyles', function(target) {

    grunt.task.run(['sass:' + target, 'postcss:' + target]);
  });

  // scripts
  grunt.task.registerTask('scripts', 'BuildScripts', function(target) {

    grunt.task.run(['browserify:' + target]);
  });


  // dev
  grunt.registerTask('lint', [

    'eslint',
    'scsslint',
  ]);

  // dev
  grunt.registerTask('dev', [

    'styles:dev',
    'scripts:dev',
    'browserSync:dev',
    'watch'
  ]);

  // build
  grunt.registerTask('build', [

    'styles:build',
    'scripts:build'
  ]);
};
