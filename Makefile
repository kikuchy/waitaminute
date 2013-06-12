ZIP = zip
OEX = waitaminute.oex
OSOURCE = config.xml includes/main.js index.html

all:	$(OEX)

$(OEX):$(OSOURCE)
	$(ZIP) $(OEX) $(OSOURCE)
