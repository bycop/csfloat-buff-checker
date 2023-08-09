function injectContentScript(tabId) {
	chrome.scripting.executeScript({
		target: { tabId: tabId },
		files: ['content.js'],
	});
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.url) {
		injectContentScript(tabId);
	}
});

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({'url': "https://github.com/bycop"}, function (tab) {
  });
});
