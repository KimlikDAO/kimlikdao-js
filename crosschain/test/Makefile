build/crosschain/test/unlockable.compiled-test.js: crosschain/test/unlockable.compiled-test.js \
    crosschain/unlockable.d.js crosschain/unlockable.js \
    crosschain/signer.js \
    crypto/modular.js crypto/secp256k1.js \
    crypto/sha3.js \
    ethereum/eth.d.js ethereum/encryptedData.d.js ethereum/evm.js \
    testing/assert.js testing/nodejs.d.js testing/nodejs.js \
    testing/vm.js testing/crosschain.js \
    util/çevir.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --jscomp_error=strictCheckTypes \
                             --jscomp_error=missingProperties \
                             --jscomp_error=unusedLocalVariables \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs testing/nodejs.js $@ -m -c toplevel,unsafe -o $@
	node $@
	wc $@

.PHONY: crosschain.test
crosschain.test: $(addprefix build/, $(wildcard crosschain/test/*.compiled-test.js))