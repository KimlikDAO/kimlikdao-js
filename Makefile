.PHONY: test
test: crypto.test

include crypto/test/Makefile

clean:
	rm -rf build
