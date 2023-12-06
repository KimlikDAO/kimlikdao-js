compressions = $(1) $(addsuffix .br, $(1)) $(addsuffix .gz, $(1))

removeLang = $(subst -tr,,$(subst -en,,$(1)))

Lang-en := false
Lang-tr := true

build/%.svg: %.svg lib/birimler/svgoConfig.js
	mkdir -p $(dir $@)
	node lib/birimler/işleyici $<
	yarn svgo --config lib/birimler/svgoConfig.js $@ --output $@

build/%.isvg: %.svg lib/birimler/svgoInlineConfig.js
	mkdir -p $(dir $@)
	yarn svgo --config lib/birimler/svgoInlineConfig.js $< --output $@

%.gz: %
	cp $< $@.tmp
	touch -d 2022-01-01T00:00:00 $@.tmp
	zopfli --force --best --i20 $@.tmp
	mv $@.tmp.gz $<.gz
	rm -f $@.tmp

%.br: %
	cp $< $@.tmp
	touch -d 2022-01-01T00:00:00 $@.tmp
	brotli --force -w 24 --quality=11 --rm --output=$@ $@.tmp
	touch $@

.SECONDARY:
