build/did/test/decryptedSections.compiled-test.js: did/test/decryptedSections.compiled-test.js \
    did/*.d.js did/section.js did/decryptedSections.js \
    crypto/sha3.js crypto/modular.js crypto/secp256k1.js \
    ethereum/*.d.js ethereum/evm.js \
    ethereum/unlockable.js \
    node/nvi.d.js \
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

build/did/test/section.compiled-test.js: did/test/section.compiled-test.js \
    did/*.d.js did/section.js \
    crypto/sha3.js crypto/modular.js crypto/secp256k1.js \
    ethereum/*.d.js ethereum/evm.js \
    ethereum/unlockable.js \
    node/nvi.d.js \
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

build/did/test/verifiableID.compiled-test.js: did/test/verifiableID.compiled-test.js \
    crypto/wesolowski.js crypto/sha3.js \
    crypto/secp256k1.js crypto/modular.js \
    did/*.d.js did/verifiableID.js \
    ethereum/*.d.js ethereum/evm.js \
    node/nvi.d.js \
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
	yarn uglifyjs $@ -m -o $@
	node $@

.PHONY: did.test
did.test: $(addprefix build/, $(wildcard did/test/*.compiled-test.js))
