.PHONY: test
test: crypto.test did.test ethereum.test

include crypto/test/Makefile
include did/test/Makefile
include ethereum/test/Makefile

clean:
	rm -rf build
