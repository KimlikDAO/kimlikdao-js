.PHONY: test
test: api.test cloudflare.test crosschain.test crypto.test \
      did.test ethereum.test node.test util.test

.PHONY: bench
bench: crypto.bench

include api/test/Makefile
include cloudflare/test/Makefile
include crosschain/test/Makefile
include crypto/bench/Makefile
include crypto/test/Makefile
include did/test/Makefile
include ethereum/test/Makefile
include node/test/Makefile
include util/test/Makefile

clean:
	rm -rf build
