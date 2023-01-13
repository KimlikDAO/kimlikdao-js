.PHONY: test
test: crypto.test did.test ethereum.test node.test

.PHONY: benchmark
benchmark: crypto.benchmark

include crypto/bench/Makefile
include crypto/test/Makefile
include did/test/Makefile
include ethereum/test/Makefile
include node/test/Makefile

clean:
	rm -rf build
