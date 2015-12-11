function SameTab_CheckTabs (url, sendResponse) {
	console.log("SameTab: CheckTabs");

    for (var i = 0; i < excludeUrls.length; i++) {
        if (url.match(excludeUrls[i])) {
            console.log("URL in exclude list");
            return;
        }
    }

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

                // do reload tab if required
                if (doReload) {
                    chrome.tabs.reload(keep.id);
                }
				// remove duplicates
				for (var i = 0; i < toClose.length; i++) {
					chrome.tabs.remove(toClose[i].id);
				}

                if (showNotifications) {
                    chrome.notifications.create("SameTabCleared", {
                        "type": "basic",
                        "iconUrl": "icon.png",
                        "title": "SameTab",
                        "message": ["Closed ", toClose.length, " matching tab(s)."].join("")
                    }, function (nId) {
                        setTimeout(function () {
                            chrome.notifications.clear(nId);
                        }, 3000);
                    });
                }
			}

		}
	);
}

var excludeUrls = [];
var showNotifications = false;
var doReload = false;

function SameTab_LoadSettings() {
    chrome.storage.sync.get(["showNotifications", "excludeItemList", "doReload"], function (items) {
        showNotifications = !!items["showNotifications"];
        doReload = !!items["doReload"];
        excludeUrls = [];
        if (items["excludeItemList"]) {
            for (var i = 0; i < items["excludeItemList"].length; i++) {
                excludeUrls.push(items["excludeItemList"][i]);
            }
        }
    });
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
    	if (request.target == "SameTab") {
            if (request.message == "CheckTabs") {
          		SameTab_CheckTabs(request.url, sendResponse);
    	    } else if (request.message == "LoadSettings") {
                SameTab_LoadSettings();
            }
        }
	}
);

SameTab_LoadSettings();