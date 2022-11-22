build/crypto/test/secp256k1.compiled-test.js: crypto/test/secp256k1.compiled-test.js \
                                              crypto/secp256k1.js util/çevir.js testing/assert.js crypto/modular.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --emit_use_strict \
                             --language_in UNSTABLE \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs $@ -m -o $@
	node $@

build/crypto/test/modular.compiled-test.js: crypto/test/modular.compiled-test.js \
                                            crypto/modular.js util/çevir.js testing/assert.js \
                                            crypto/secp256k1.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --emit_use_strict \
                             --language_in UNSTABLE \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs $@ -m -o $@
	node $@

build/crypto/test/sha3.compiled-test.js: crypto/test/sha3.compiled-test.js crypto/test/sha3_*.js \
                                         crypto/sha3.js util/çevir.js testing/assert.js
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

.PHONY: crypto.test
crypto.test: $(addprefix build/, $(wildcard crypto/test/*.compiled-test.js))
