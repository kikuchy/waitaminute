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
	// クロージャーで元のapplyを閉じ込めておく
	var dummyApply = function(orgApply){
		/*var orgApply = apl;*/
		return function(e){
			var self = this;
			// 評価押下後にページを離れるときは即時送信
			if(e.type.indexOf("unload") > -1){
				orgApply.apply(self, [self]);
				return;
			}
			// updateでtmpRateに入った値をrateに移して送信準備
			this.rate = this.tmpRate;
			this.ratingContainer.unbind('mouseleave');
			if(this.timerId){
				clearTimeout(this.timerId);
				this.timerId = undefined;
			}
			this.timerId = setTimeout(function(){
				orgApply.apply(self, [self]);
			}, "%timeoutcount%" * 1);
		};
	};

	// rateではなくtmpRateに入るように書き直し
	var dummyUpdate = function(orgUpdate){
		return function(x, y) {
		var container = this.ratingContainer,
			width = this.width,
			height = this.height,
			offset = this.offset || (this.offset = container.offset()),
			top = y - offset.top + 1,
			left = Math.max(x - Math.ceil(offset.left), 0) + 1, // [Chrome 22] 0.5px ズレる
			rate = Math.ceil(left / width);

		if (pixiv.user.bitter) {
			left -= width * (rate - 1);
			// pixiv.log('[rating.update] rate offset:', rate, left, top, x, offset.left, y, offset.top);
			switch (rate) {
			case 1:
				rate = this.slim(rate, left, top, 0.45, 0.55);
				break;
			case 2:
				rate = this.slim(rate, left, top, 0.4, 0.6);
				break;
			}
		}

		if (rate !== this.tmpRate) {
			container
				.removeClass('rate-' + this.tmpRate)
				.addClass('rate-' + rate);
			this.tmpRate = rate;
		}
	};
	};

	// rateでなくtmpRateを使うよう書き直し
	var dummyClear = function(orgClear){
		return function() {
			this.ratingContainer.removeClass('rate-' + this.tmpRate);
			this.tmpRate = 0;
			this.offset = null;
		}
	};

	// イベントの張り直し
	var swapClickEvent = function(){
		pixiv.rating.ratingContainer.unbind();
		pixiv.rating.ratingContainer
			.mousemove(function(e){ pixiv.rating.update(e.pageX, e.pageY); })
			.mouseleave($.proxy(pixiv.rating.clear, pixiv.rating));
		pixiv.user.loggedIn && pixiv.rating.ratingContainer.click($.proxy(pixiv.rating.apply, pixiv.rating));
		var unloadedEventHandler = function(e){
			if(pixiv.rating.timerId){
				pixiv.rating.apply.apply(pixiv.rating, [e]);
			}
		};
		// chromeではunloadのタイミングではrate送信が間に合わないので、beforeunloadでrateを送る
		window.addEventListener(((window.onbeforeunload !== undefined) ? 'beforeunload' : "unload"), unloadedEventHandler, false);
	};

	// Extensionの空間からはページ内のjavascript空間にアクセスできないので、scriptタグを作ってどうにかしのぐ
	window.addEventListener('DOMContentLoaded', function(){
		var settings = (window.widget && widget.preferences) ? widget.preferences : (localStorage ||{});
		var timeoutcount = (settings.timeout || 3) * 1000;
		var s = window.document.createElement("script");
		s.type = "text/javascript";
		s.innerHTML = "\n$(function(){\n" +
			"pixiv.rating.update = " + dummyUpdate.toString() + "(pixiv.rating.update);\n" +
			"pixiv.rating.clear = " + dummyClear.toString() + "(pixiv.rating.clear);\n" +
			"pixiv.rating.apply = " + dummyApply.toString().replace("%timeoutcount%", timeoutcount) + "(pixiv.rating.apply);\n" +
			"!" + swapClickEvent.toString() + "();" + "});\n";
		window.document.head.appendChild(s);
	}, false);
})();
