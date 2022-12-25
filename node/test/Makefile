build/node/test/ipfs.compiled-test.js: node/test/ipfs.compiled-test.js node/ipfs.js \
    testing/assert.js \
    util/çevir.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --emit_use_strict \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs testing/nodeHeader.js $@ -m -o $@
	node $@

.PHONY: node.test
node.test: $(addprefix build/, $(wildcard node/test/*.compiled-test.js))
