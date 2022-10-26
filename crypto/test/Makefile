build/crypto/test/sha3.compiled-test.js: crypto/test/sha3.compiled-test.js crypto/test/*.js \
                                         crypto/sha3.js util/çevir.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --emit_use_strict \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs $@ -m -o $@
	node $@

crypto.test: build/crypto/test/sha3.compiled-test.js

.PHONY: test.test
