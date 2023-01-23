build/node/test/ipfs.compiled-test.js: node/test/ipfs.compiled-test.js \
    node/ipfs.d.js node/ipfs.js node/error.d.js \
    testing/assert.js testing/nodejs.d.js testing/nodejs.js \
    util/çevir.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --jscomp_error=unusedLocalVariables \
                             --jscomp_error=strictCheckTypes \
                             --emit_use_strict \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs testing/nodejs.js $@ -m -c toplevel,unsafe -o $@
	node $@
	wc $@

.PHONY: node.test
node.test: $(addprefix build/, $(wildcard node/test/*.compiled-test.js))
