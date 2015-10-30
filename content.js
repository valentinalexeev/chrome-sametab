function SameTab_Content_CallExtension() {
	console.log("SameTab_Content_CallExtension");
	chrome.runtime.sendMessage(
		{
			target: "SameTab",
			message: "CheckTabs",
			url: document.location.toString()
		},
		function (response) {
			console.log(response);
		}
	);
}

SameTab_Content_CallExtension();