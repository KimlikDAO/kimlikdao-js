build/crypto/test/secp256k1/unit.compiled-test.js: crypto/test/secp256k1/unit.compiled-test.js \
    crypto/secp256k1.js crypto/modular.js \
    testing/assert.js testing/nodejs.js testing/nodejs.d.js \
    util/çevir.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --jscomp_error=strictCheckTypes \
                             --jscomp_error=unusedLocalVariables \
                             --emit_use_strict \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs testing/nodejs.js $@ -m -c toplevel,unsafe -o $@
	node $@
	wc $@

build/crypto/test/secp256k1/nobleVectors.compiled-test.js: \
    crypto/test/secp256k1/nobleVectors.compiled-test.js \
		crypto/secp256k1.js crypto/modular.js \
		testing/assert.js testing/fsPromises.d.js \
		testing/nodejs.d.js \
		util/çevir.js
	mkdir -p $(dir $@)
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
                             --jscomp_error=strictCheckTypes \
                             --jscomp_error=unusedLocalVariables \
                             --emit_use_strict \
                             --module_resolution NODE \
                             --assume_function_wrapper \
                             --dependency_mode PRUNE \
                             --entry_point $< \
                             --js $^ \
                             --js_output_file $@
	yarn uglifyjs testing/fsPromises.js $@ -m -c toplevel,unsafe -o $@
	node $@
	wc $@
