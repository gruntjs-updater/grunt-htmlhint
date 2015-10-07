/*
 * grunt-htmlhint
 * https://github.com/yaniswang/grunt-htmlhint
 *
 * Copyright (c) 2013 Yanis Wang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask('htmlhint', 'Validate html files with htmlhint.', function() {

        var HTMLHint = require("htmlhint").HTMLHint;
        var options = this.options({
                force: false
            }),
            arrFilesSrc = this.filesSrc,
            verbose = grunt.verbose;

        if (options.htmlhintrc) {
            var rc = grunt.file.readJSON(options.htmlhintrc);
            grunt.util._.defaults(options, rc);
            delete options.htmlhintrc;
        }

        var force = options.force;
        delete options.force;

        var hintCount = 0;
        var fileCount = 0;
        arrFilesSrc.forEach(function(filepath) {
            var file = grunt.file.read(filepath),
                msg = "   " + filepath,
                messages;
            if (file.length) {
                messages = HTMLHint.verify(file, options);
                if (messages.length > 0) {
                    grunt.log.writeln(msg);
                    messages.forEach(function(hint) {
                        grunt.log.writeln('      L%d |%s', hint.line, hint.evidence.replace(/\t/g, ' ').grey);
                        grunt.log.writeln('      %s^ %s', repeatStr(String(hint.line).length + 3 + hint.col - 1), (hint.message + ' (' + hint.rule.id + ')')[hint.type === 'error' ? 'red' : 'yellow']);
                        hintCount++;
                    });
                    grunt.log.writeln('');
                    fileCount ++;
                }
            }
        });

        if (hintCount > 0) {
            grunt.log.error('%d errors in %d files'.red, hintCount, fileCount);
            return force;
        }
        else{
            verbose.ok();
        }

        grunt.log.ok(arrFilesSrc.length + ' file' + (arrFilesSrc.length === 1 ? '' : 's') + ' lint free.');

    });


    function repeatStr(n, str){
        return new Array(n + 1).join(str || ' ');
    }
};
