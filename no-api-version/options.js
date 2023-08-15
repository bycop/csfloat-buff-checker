document.addEventListener('DOMContentLoaded', () => {
	const enableStickersOption = document.getElementById('enableStickers');
	const stickerThresholdOption = document.getElementById('stickerThreshold');
	const profitColorOption = document.getElementById('profitColor');
	const lossColorOption = document.getElementById('lossColor');
	const neutralColorOption = document.getElementById('neutralColor');
	const resetButton = document.getElementById('reset');

	chrome.storage.local.get(['enableStickers', 'estickerThreshold', 'profitColor', 'lossColor', 'neutralColor'], (result) => {
		enableStickersOption.checked = result.enableStickers || false;
		stickerThresholdOption.value = result.estickerThreshold || 50;
		profitColorOption.value = result.profitColor || '#00FF00';
		lossColorOption.value = result.lossColor || '#FF0000';
		neutralColorOption.value = result.neutralColor || '#FFA500';
	});

	enableStickersOption.addEventListener('change', () => {
		const enableStickers = enableStickersOption.checked;
		chrome.storage.local.set({'enableStickers': enableStickers});
	});

	stickerThresholdOption.addEventListener('change', () => {
		const stickerThreshold = stickerThresholdOption.value;
		chrome.storage.local.set({'stickerThreshold': stickerThreshold});
	});

	profitColorOption.addEventListener('change', () => {
		const profitColor = profitColorOption.value;
		chrome.storage.local.set({ 'profitColor': profitColor });
	});

	lossColorOption.addEventListener('change', () => {
		const lossColor = lossColorOption.value;
		chrome.storage.local.set({ 'lossColor': lossColor });
	});

	neutralColorOption.addEventListener('change', () => {
		const neutralColor = neutralColorOption.value;
		chrome.storage.local.set({ 'neutralColor': neutralColor });
	});

	resetButton.addEventListener('click', () => {
		chrome.storage.local.set({
			enableStickers: false,
			stickerThreshold: 50,
			profitColor: '#00FF00',
			lossColor: '#FF0000',
			neutralColor: '#FFA500'
		});
		enableStickersOption.checked = false;
		stickerThresholdOption.value = 50;
		profitColorOption.value = '#00FF00';
		lossColorOption.value = '#FF0000';
		neutralColorOption.value = '#FFA500';
	});
});
