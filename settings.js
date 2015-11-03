function SameTab_LoadSettings() {
    chrome.storage.sync.get(["showNotifications", "excludeItemList"], function (items) {
        console.log(items);
        document.getElementById("showNotifications").checked = !!items["showNotifications"];
        if (items["excludeItemList"]) {
            SameTab_ExcludeItemList_Clear();
            for (var i = 0; i < items["excludeItemList"].length; i++) {
                SameTab_ExcludeItemList_AddItem(items["excludeItemList"][i]);
            }
        }
    })
}

function SameTab_ExcludeItemList_AddItem(item) {
    var elem = document.createElement("li");
    elem.appendChild(document.createTextNode(item));
    var removeBtn = document.createElement("input");
    removeBtn.type = "button";
    removeBtn.onclick = SameTab_RemoveItem;
    removeBtn.value = "-";
    elem.appendChild(removeBtn);
    document.getElementById("excludeItemList").appendChild(elem);
    SameTab_SyncList();
}

function SameTab_ExcludeItemList_Clear() {
    document.getElementById("excludeItemList").innerHTML = "";
}

function SameTab_RemoveItem(e) {
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    SameTab_SyncList();
}

function SameTab_SyncList() {
    var children = document.getElementById("excludeItemList").children;
    var items = [];

    for (var i = 0; i < children.length; i++) {
        items.push(children[i].innerText);
    }

    chrome.storage.sync.set({
        "excludeItemList": items
    }, function () {
        SameTab_NotifySettingsUpdated();
        console.log("excludeItemList saved");
    });
}

function SameTab_ShowNotification_OnChange(e) {
    chrome.storage.sync.set({
        "showNotifications": !!e.target.checked
    }, function () {
        console.log("showNotifications set");
        SameTab_NotifySettingsUpdated();
    });
}

function SameTab_NotifySettingsUpdated() {
    chrome.runtime.sendMessage(
		{
			target: "SameTab",
			message: "LoadSettings"
		},
		function (response) {
			console.log(response);
		}
	);
}

function SameTab_AddButton_OnClick(e) {
    SameTab_ExcludeItemList_AddItem(document.getElementById("itemToExclude").value);
}

function SameTab_SetEventHandlers() {
    document.getElementById("showNotifications").onchange = SameTab_ShowNotification_OnChange;
    document.getElementById("addButton").onclick = SameTab_AddButton_OnClick;
}

function SameTab_PopupLoaded() {
    SameTab_LoadSettings();
    SameTab_SetEventHandlers();
}

window.onload = SameTab_PopupLoaded;
