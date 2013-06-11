// ==UserScript==
// @include http://www.pixiv.net/member_illust.php?*mode=manga*&illust_id=*
// @include http://www.pixiv.net/member_illust.php?*illust_id=*&mode=manga*
// @include http://www.pixiv.net/member_illust.php?*mode=medium*&illust_id=*
// @include http://www.pixiv.net/member_illust.php?*illust_id=*&mode=medium*
// @include http://www.pixiv.net/novel/show.php?id=*
// ==/UserScript==

// UserScriptのincludeだと何回も動いてしまうのでその対策
if(window.location.href.indexOf("http://www.pixiv.net/") === 0)
(function(){
	var dummyApply = function(orgApply){
		/*var orgApply = apl;*/
		return function(e){
			if(window.confirm('本当に評価していいですか？'))
				orgApply.apply(this, this);
		};
	};

	var swapClickEvent = function(){
		pixiv.rating.ratingContainer.unbind('click');
		pixiv.rating.ratingContainer.click($.proxy(pixiv.rating.apply, pixiv.rating));
	};

	window.addEventListener('DOMContentLoaded', function(){
		//console.log(dummyApply.toString());
		var s = window.document.createElement("script");
		s.type = "text/javascript";
		s.innerHTML = "\n" + "pixiv.rating.apply = " + dummyApply.toString() + "(pixiv.rating.apply);\n" + "(" + swapClickEvent.toString() + ")();" + "\n";
		window.document.body.appendChild(s);
	}, false);
})();
