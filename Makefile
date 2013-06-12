ZIP = zip
OEX = waitaminute.oex
OSOURCE = config.xml includes/main.js index.html
CRX = waitaminue.crx
CSOURCE = manifest.json includes/main.js waitaminute.pem
ALLTARGET = $(OEX) $(CRX)

all:	$(ALLTARGET)

$(OEX):$(OSOURCE)
	$(ZIP) $(OEX) $(OSOURCE)

$(CRX):	$(CSOURCE)
	$(ZIP) $(CRX) $(CSOURCE)
