build/did/test/section.compiled-test.js: did/test/section.compiled-test.js \
    did/section.d.js did/section.js \
    did/exposureReport.d.js did/exposureReport.js \
    crypto/sha3.js crypto/modular.js crypto/secp256k1.js \
    ethereum/evm.js ethereum/jsonrpc.js \
    ethereum/provider.js ethereum/unlockables.js \
    ethereum/ERC721Unlockable.js \
    node/nvi.js \
    testing/assert.js testing/nodeHeader.js \
    util/çevir.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs testing/nodeHeader.js $@ -m -o $@
	node $@

.PHONY: did.test
did.test: build/did/test/section.compiled-test.js
