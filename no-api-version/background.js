function injectContentScript(tabId) {
	if (chrome.scription) {
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			files: ['content.js'],
		});
	}
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.url) {
		injectContentScript(tabId);
	}
});

chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.create({'url': "https://github.com/bycop"}, function (tab) {
  });
});
