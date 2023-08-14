build/util/test/çevir.compiled-test.js: util/test/çevir.compiled-test.js \
    testing/assert.js testing/nodejs.d.js \
    util/çevir.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --jscomp_error=strictCheckTypes \
                             --jscomp_error=unusedLocalVariables \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs $@ -m -c toplevel,unsafe -o $@
	node $@
	wc $@

.PHONY: util.test
util.test: $(addprefix build/, $(wildcard util/test/*.compiled-test.js))
