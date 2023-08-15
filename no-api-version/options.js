document.addEventListener('DOMContentLoaded', () => {
	const enableStickersOption = document.getElementById('enableStickers');
	const profitColorOption = document.getElementById('profitColor');
	const lossColorOption = document.getElementById('lossColor');
	const neutralColorOption = document.getElementById('neutralColor');
	const resetButton = document.getElementById('reset');

	chrome.storage.local.get(['enableStickers', 'profitColor', 'lossColor', 'neutralColor'], (result) => {
		enableStickersOption.checked = result.enableStickers || false;
		profitColorOption.value = result.profitColor || '#00FF00';
		lossColorOption.value = result.lossColor || '#FF0000';
		neutralColorOption.value = result.neutralColor || '#FFA500';
	});

	enableStickersOption.addEventListener('change', () => {
		const enableStickers = enableStickersOption.checked;
		chrome.storage.local.set({'enableStickers': enableStickers});
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
			profitColor: '#00FF00',
			lossColor: '#FF0000',
			neutralColor: '#FFA500'
		});
		enableStickersOption.checked = false;
		profitColorOption.value = '#00FF00';
		lossColorOption.value = '#FF0000';
		neutralColorOption.value = '#FFA500';
	});
});
