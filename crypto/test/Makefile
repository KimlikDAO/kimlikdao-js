build/crypto/test/secp256k1.compiled-test.js: crypto/test/secp256k1.compiled-test.js crypto/secp256k1.js \
                                              crypto/modular.js \
                                              testing/assert.js testing/nodeHeader.js \
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

build/crypto/test/secp256k1.bench.js: crypto/test/secp256k1.bench.js crypto/secp256k1.js \
                                      crypto/modular.js \
                                      testing/assert.js testing/nodeHeader.js \
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

build/crypto/test/integration.compiled-test.js: crypto/test/integration.compiled-test.js \
                                                crypto/secp256k1.js crypto/sha3.js crypto/modular.js \
                                                ethereum/evm.js \
                                                testing/assert.js testing/nodeHeader.js \
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

build/crypto/test/modular.compiled-test.js: crypto/test/modular.compiled-test.js \
                                            crypto/modular.js \
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
	yarn uglifyjs $@ -m -o $@
	node $@

build/crypto/test/sha3.compiled-test.js: crypto/test/sha3.compiled-test.js crypto/test/sha3_*.js \
                                         crypto/sha3.js \
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
	yarn uglifyjs $@ -m -o $@
	node $@

.PHONY: crypto/secp256k1
crypto/secp256k1: build/crypto/test/secp256k1.bench.js \
                  build/crypto/test/secp256k1.compiled-test.js

.PHONY: crypto.test
crypto.test: $(addprefix build/, $(wildcard crypto/test/*.compiled-test.js))
