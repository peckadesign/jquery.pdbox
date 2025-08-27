module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				stripBanners: true,
				banner: '/**\n' +
					' * <%= pkg.title %> - <%= pkg.description %> \n' +
					' * <%= pkg.homepage %>\n' +
					' *\n' +
					' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
					' * @copyright Copyright (c) 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
					' * @license <%= pkg.license %>\n' +
					' *\n' +
					' * @version <%= pkg.version %>\n' +
					' */\n'
			},
			production: {
				src: [
					'node_modules/tabbable/dist/index.umd.min.js',
					'node_modules/focus-trap/dist/focus-trap.umd.min.js',
					'src/js/jquery.pdbox.js'
				],
				dest: 'dist/js/jquery.pdbox.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.title %> <%= pkg.version %> | <%= pkg.license %> | <%= pkg.author.name %>, <%= pkg.homepage %> */\n'
			},
			production: {
				src: 'dist/js/jquery.pdbox.js',
				dest: 'dist/js/jquery.pdbox.min.js'
			}
		},

		// tasks
		less: {
			production: {
				src: 'src/less/pdbox.less',
				dest: 'dist/css/pdbox.css'
			}
		},

		postcss: {
			dist: {
				options: {
					processors: [
						require('autoprefixer')() // viz browserslist v package.json
					]
				},
				src: 'dist/css/pdbox.css',
				dest: 'dist/css/pdbox.css'
			},
			distMin: {
				options: {
					processors: [
						require('autoprefixer')(), // viz browserslist v package.json
						require('cssnano')({
							discardComments: {
								removeAll: true
							}
						})
					]
				},
				src: 'dist/css/pdbox.css',
				dest: 'dist/css/pdbox.min.css'
			}
		},

		watch: {
			scripts: {
				files: ['src/js/*.js'],
				tasks: ['scripts:development'],
				options: {
					spawn: false
				}
			},
			styles: {
				files: ['src/less/*.less'],
				tasks: ['styles'],
				options: {
					spawn: false
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('scripts', ['concat', 'uglify']);
	grunt.registerTask('styles', ['less', 'postcss']);

	grunt.registerTask('default', ['scripts', 'styles']);
};
