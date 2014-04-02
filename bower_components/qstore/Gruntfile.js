module.exports = function(grunt) {

	var banner = grunt.file.read('src/banner.txt');

	grunt.initConfig({

		pkg: grunt.file.readJSON('bower.json'),

		qunit: {
			all: ['test/**/*.html']
		},

		concat: {
			options: {
				banner: banner
			},
			all: {
				files: {
					'qstore.js': ['src/data.js']
				}
			}
		},

		uglify: {
			options: {
				preserveComments: 'some'
			},
			all: {
				files: {
					'qstore.min.js': 'qstore.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('test', ['qunit']);
	grunt.registerTask('build', ['qunit', 'concat', 'uglify']);

};
