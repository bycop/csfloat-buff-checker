document.addEventListener('DOMContentLoaded', async function () {
	const enableStickersOption = document.getElementById('enableStickers');
	const stickerValueThresholdOption = document.getElementById('stickerValueThreshold');
	const profitColorOption = document.getElementById('profitColor');
	const lossColorOption = document.getElementById('lossColor');
	const neutralColorOption = document.getElementById('neutralColor');
	const resetButton = document.getElementById('reset');

	await chrome.storage.local.get(['enableStickers', 'stickerValueThreshold', 'profitColor', 'lossColor', 'neutralColor'], function (result) {
		enableStickersOption.checked = result.enableStickers || false;
		stickerValueThresholdOption.value = result.stickerValueThreshold || 50;
		profitColorOption.value = result.profitColor || '#00FF00';
		lossColorOption.value = result.lossColor || '#FF0000';
		neutralColorOption.value = result.neutralColor || '#FFA500';
	});

	enableStickersOption.addEventListener('change', function () {
		const enableStickers = enableStickersOption.checked;
		chrome.storage.local.set({ enableStickers });
	});

	neutralColorOption.addEventListener('change', function () {
		const stickerValueThreshold = stickerValueThresholdOption.value;
		chrome.storage.local.set({ stickerValueThreshold });
	});

	profitColorOption.addEventListener('change', function () {
		const profitColor = profitColorOption.value;
		chrome.storage.local.set({ profitColor });
	});

	lossColorOption.addEventListener('change', function () {
		const lossColor = lossColorOption.value;
		chrome.storage.local.set({ lossColor });
	});

	neutralColorOption.addEventListener('change', function () {
		const neutralColor = neutralColorOption.value;
		chrome.storage.local.set({ neutralColor });
	});

	resetButton.addEventListener('click', function () {
		chrome.storage.local.set({
			enableStickers: false,
			stickerValueThreshold: 50,
			profitColor: '#00FF00',
			lossColor: '#FF0000',
			neutralColor: '#FFA500'
		});
		enableStickersOption.checked = false;
		stickerValueThresholdOption.value = 50
		profitColorOption.value = '#00FF00';
		lossColorOption.value = '#FF0000';
		neutralColorOption.value = '#FFA500';
	});
});
