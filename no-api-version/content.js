
function parseItem(name, details) {

  const item = {
    name: name.trim(),
    quality: null,
    special: null,
    details: null,
    star: false
  };

  if (item.name.startsWith("★")) {
    item.star = true;
    item.name = item.name.substring(2).trim();
  }

  const qualityMatch = details.match(/(Factory New|Minimal Wear|Well-Worn|Field-Tested|Battle-Scarred|Not painted)/);
  const specialMatch = details.match(/(StatTrak™|Souvenir)/);

  if (qualityMatch) {
    item.quality = qualityMatch[0];
    details = details.replace(qualityMatch[0], "").trim();
  }

  if (specialMatch) {
    item.special = specialMatch[0];
    details = details.replace(specialMatch[0], "").replace('(', '').replace(')', '').trim();
  }

  if (details) {
    item.details = details;
  }

  const whitelistedStarts = ["Autograph Capsule"];

  if (item.name.indexOf('|') == -1 || whitelistedStarts.includes(item.name.split('|')[0].trim())) {
    item.quality = "Not painted";
  }

  return item;
}

function formatItem(item) {
  if (item.details && item.details.endsWith("Sticker")) {
    return `Sticker | ${item.name}`;
  }

  return `${item.star ? "★ " : ""}${item.special ? item.special + " " : ""}${item.name}${item.quality !== "Not painted" ? ` (${item.quality})` : ''}`;
}

async function getBuffPrice(itemName, itemDetails) {
  const item = parseItem(itemName, itemDetails);
  const name = formatItem(item);

  try {
    const response = await fetch('https://api.steaminventoryhelper.com/v2/live-prices/getPrices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "appId": "730",
        "markets": ["buff163"],
        "items": [name]
      })
    });

    const data = await response.json();

    return data?.items[name]?.buff163?.price || "N/A";
  } catch (error) {
    console.error('Error fetching data:', error);
    return "N/A";
  }
}

function findItemNameInContainer(container) {
  if (!container) return null;
  const children = container.children;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (child.classList.contains('item-name')) {
      return child;
    }

    if (child.children.length > 0) {
      const result = findItemNameInContainer(child);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

async function copyAndPasteItemName() {
  const cdkOverlayContainer = document.querySelector('.cdk-overlay-container');

  if (!cdkOverlayContainer) return null;

  const itemNameElement = findItemNameInContainer(cdkOverlayContainer);

  if (!itemNameElement || !itemNameElement.nextElementSibling) return null;

  const divElement = itemNameElement.nextElementSibling;
  const divTextContent = divElement.textContent.trim();
  const ngStarInsertedDiv = cdkOverlayContainer.querySelector('.price.ng-star-inserted, .price .ng-star-inserted');

  const price = await getBuffPrice(itemNameElement.innerText, divTextContent);

  if (!ngStarInsertedDiv) return null;

  const newDiv = document.createElement('div');
  newDiv.style.fontSize = '20px';
  newDiv.id = 'buff-price';

  if (!price && price !== 0) {
    newDiv.style.color = 'red';
    newDiv.textContent = 'No price found';
  } else {
    const actualPrice = ngStarInsertedDiv.textContent.trim();
    const actualPriceNumber = parseFloat(actualPrice.replace('$', '').replace(',', ''));

    const difference = price - actualPriceNumber;
    const differencePercentage = (difference / actualPriceNumber) * 100;
    const discount = Math.round(differencePercentage);

    if (isNaN(discount)) {
      newDiv.style.color = 'orange';
      newDiv.textContent = `$${price}`;
    }
    else if (actualPriceNumber < price) {
      newDiv.style.color = 'green';
      newDiv.textContent = `$${price} (+${discount}%)`;
    } else {
      newDiv.style.color = 'red';
      newDiv.textContent = `$${price} (${discount}%)`;
    }
  }

  ngStarInsertedDiv.parentNode.insertBefore(newDiv, ngStarInsertedDiv.nextSibling);
}

setInterval(() => {
  const cdkOverlayContainer = document.querySelector('.cdk-overlay-container');

  if (cdkOverlayContainer && cdkOverlayContainer.children.length > 0 && !cdkOverlayContainer.querySelector('#buff-price')) {
    copyAndPasteItemName();
  }
}, 1000);