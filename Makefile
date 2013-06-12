ZIP = zip
CHROME = /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
OEX = waitaminute.oex
OSOURCE = config.xml includes/main.js index.html background.js
CRX = waitaminute.crx
CSOURCE = manifest.json includes/main.js background.js
COPTIONS = --pack-extension=$(PWD)  --no-message-box
ALLTARGET = $(OEX) $(CRX)

all:	$(ALLTARGET)

$(OEX):$(OSOURCE)
	$(ZIP) $(OEX) $(OSOURCE)

$(CRX):	$(CSOURCE)
	$(CHROME) $(COPTIONS)
	mv ../$(CRX) ./

clean:
	rm $(ALLTARGET)
