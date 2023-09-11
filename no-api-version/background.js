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
	chrome.tabs.create({ 'url': "https://github.com/bycop" }, function (tab) {
	});
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === 'getSettings') {
		chrome.storage.local.get(['enableStickers', 'profitColor', 'lossColor', 'neutralColor', 'sihToken'], function (result) {
			const settings = {
				enableStickers: result.enableStickers || true,
				profitColor: result.profitColor || '#00FF00',
				lossColor: result.lossColor || '#FF0000',
				neutralColor: result.neutralColor || '#FFA500',
				sihToken: result.sihToken || ''
			};
			sendResponse(settings);
		});
		return true;
	}
});