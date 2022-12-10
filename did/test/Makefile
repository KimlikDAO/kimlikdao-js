build/did/test/infoSection.compiled-test.js: did/test/infoSection.compiled-test.js \
    did/infoSection.js did/types.js \
    api/edevletApi.js \
    crypto/sha3.js \
    ethereum/jsonrpc.js ethereum/provider.js ethereum/unlockables.js \
    ethereum/ERC721Unlockable.js \
    testing/assert.js \
    util/çevir.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs $@ -m -o $@
	node $@

.PHONY: did.test
did.test: build/did/test/infoSection.compiled-test.js
