document.addEventListener('DOMContentLoaded', function () {
	const enableStickersOption = document.getElementById('enableStickers');
	const profitColorOption = document.getElementById('profitColor');
	const lossColorOption = document.getElementById('lossColor');
	const neutralColorOption = document.getElementById('neutralColor');
	const sihTokenOption = document.getElementById('sihToken');
	const resetButton = document.getElementById('reset');

	chrome.storage.local.get(['enableStickers', 'profitColor', 'lossColor', 'neutralColor', 'sihToken'], function (result) {
		enableStickersOption.checked = result.enableFeature || false;
		profitColorOption.value = result.profitColor || '#00FF00';
		lossColorOption.value = result.lossColor || '#FF0000';
		neutralColorOption.value = result.neutralColor || '#FFA500';
		sihTokenOption.value = result.sihToken || '';
	});

	enableStickersOption.addEventListener('change', function () {
		const enableFeature = checkboxOptionOption.checked;
		chrome.storage.local.set({ enableFeature });
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

	sihTokenOption.addEventListener('change', function () {
		const sihToken = sihTokenOption.value;
		chrome.storage.local.set({ sihToken });
	});

	resetButton.addEventListener('click', function () {
		chrome.storage.local.set({
			enableStickers: false,
			profitColor: '#00FF00',
			lossColor: '#FF0000',
			neutralColor: '#FFA500',
			sihToken: ''
		});
		enableStickersOption.checked = false;
		profitColorOption.value = '#00FF00';
		lossColorOption.value = '#FF0000';
		neutralColorOption.value = '#FFA500';
		sihTokenOption.value = '';
	});
});
