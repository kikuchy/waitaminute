var settings = {};
if(window.widget){
	if(widget.preferences) settings = widget.preferences;
}else{
	settings = localStorage;
}
var timeout = document.getElementById("timeout");
timeout.addEventListener('change', function(e){
	settings.timeout = this.value;
}, false);
timeout.value = settings.timeout || 3;
