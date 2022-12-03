.PHONY: test
test: crypto.test did.test

include crypto/test/Makefile
include did/test/Makefile

clean:
	rm -rf build
