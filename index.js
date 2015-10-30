function SameTab_CheckTabs (url, sendResponse) {
	console.log("SameTab: CheckTabs");
	chrome.tabs.query(
		{ currentWindow: true },
		function (tabs) {
			var keep = null;
			var toClose = [];

			for (var i = 0; i < tabs.length; i++) {
				if (keep == null && tabs[i].url == url) {
					keep = tabs[i];
				} else if (keep != null && tabs[i].url == url) {
					toClose.push(tabs[i]);
				}
			}

			console.log("To activate: ", keep);
			console.log("To close: ", toClose.length);
			if (!keep.active && toClose.length > 0) {
				// activate existing tab
				chrome.tabs.update(keep.id, {active: true});
				// remove duplicates
				for (var i = 0; i < toClose.length; i++) {
					chrome.tabs.remove(toClose[i].id);
				}
			}
		}
	);
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    	if (request.target == "SameTab" && request.message == "CheckTabs") {
      		SameTab_CheckTabs(request.url, sendResponse);
    	}
	}
);