var settings = {};
if(window.widget){
        if(widget.preferences) settings = widget.preferences;
}else{
        settings = localStorage;
}

if(window.opera)
window.addEventListener('load', function(){
	

	opera.extension.addEventListener("connect", function(e){
		e.source.postMessage({type: "ready", value: "ready"});
	}, false);
	opera.extension.addEventListener("message", function(e){
		if(e.data.type === "request"){
			if(e.data.value === "settings")
				e.source.postMessage({
					type: "response",
					value: {timeout: settings.timeout}
				});
		}
	}, false);
}, false);

if(window.chrome)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.type === "request"){
		if(request.value === "settings")
			sendResponse({
					type: "response",
					value: {timeout: settings.timeout}
				});
	}
});
