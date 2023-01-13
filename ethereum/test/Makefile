build/ethereum/test/evm.compiled-test.js: ethereum/test/evm.compiled-test.js \
    crypto/secp256k1.js crypto/sha3.js crypto/modular.js \
    ethereum/evm.js \
    testing/assert.js testing/nodejs.js testing/nodejs.d.js \
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
	yarn uglifyjs testing/nodejs.js $@ -m -o $@
	node $@

build/ethereum/test/TCKT.compiled-test.js: ethereum/test/TCKT.compiled-test.js \
    crypto/secp256k1.js crypto/sha3.js crypto/modular.js \
    ethereum/jsonrpc.d.js ethereum/provider.d.js \
    ethereum/TCKT.js ethereum/evm.js \
    testing/assert.js testing/nodejs.js testing/nodejs.d.js testing/provider.js \
    util/çevir.js
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --jscomp_error=strictCheckTypes \
                             --jscomp_error=unusedLocalVariables \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs testing/nodejs.js testing/provider.js $@ -m -o $@
	node $@

.PHONY: ethereum.test
ethereum.test: $(addprefix build/, $(wildcard ethereum/test/*.compiled-test.js))
