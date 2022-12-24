build/crypto/bench/secp256k1.bench.js: crypto/bench/secp256k1.bench.js crypto/secp256k1.js \
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
