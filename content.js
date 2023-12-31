let settings = undefined;

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
    details = details.replace(specialMatch[0], "");
  }

  if (details) {
    item.details = details.replace('(', '').replace(')', '').trim();
  }

  const whitelistedStarts = ["Autograph Capsule"];

  if (item.name.indexOf('|') == -1 || whitelistedStarts.includes(item.name.split('|')[0].trim())) {
    item.quality = "Not painted";
  }

  return item;
}

function getDiscount(buffPrice, listingPrice) {
  const discountPercentage = ((listingPrice - buffPrice) / listingPrice) * 100;

  if (isNaN(discountPercentage) || discountPercentage === 0) {
    return null;
  }

  const displayDiscountPercentage = Math.abs(discountPercentage);
  const sign = discountPercentage > 0 ? '-' : '+';

  return `${sign}${displayDiscountPercentage.toFixed(2)}%`;
}

function formatItem(item) {
  if (item.details && item.details.endsWith("Sticker")) {
    return `Sticker | ${item.name}`;
  }

  return `${item.star ? "★ " : ""}${item.special ? item.special + " " : ""}${item.name}${item.quality !== "Not painted" ? ` (${item.quality})` : ''}`;
}

async function getBuffPrice(item) {
  const name = formatItem(item);

  try {
    let url = new URL('https://tradelounge.gg/api/item');

    url.searchParams.append('marketName', name);

    if ((item.quality && item.quality !== "Not painted") && item.details) {
      url.searchParams.append('phase', item.details);
    }

    const response = await fetch(url);
    const data = await response.json().catch(() => { });

    return data?.price || "N/A";
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

  const item = parseItem(itemNameElement.innerText, divTextContent);

  const price = await getBuffPrice(item);

  if (!ngStarInsertedDiv) return null;

  const parentDiv = document.createElement('div');
  parentDiv.style.display = 'flex';
  parentDiv.style.justifyContent = 'center';

  const newDiv = document.createElement('div');
  newDiv.style.fontSize = '20px';
  newDiv.id = 'buff-price';

  if (!price && price !== 0) {
    newDiv.style.color = settings.lossColor;
    newDiv.textContent = 'No price found';
  } else {
    const actualPrice = ngStarInsertedDiv.textContent.trim();
    const actualPriceNumber = parseFloat(actualPrice.replace('$', '').replace(',', ''));

    const discount = getDiscount(actualPriceNumber, price);

    if (discount?.startsWith('-')) {
      newDiv.style.color = settings.profitColor;
      newDiv.textContent = `$${price} (${discount})`;
    } else if (discount?.startsWith('+')) {
      newDiv.style.color = settings.lossColor;
      newDiv.textContent = `$${price} (${discount})`;
    } else {
      newDiv.style.color = settings.neutralColor;
      newDiv.textContent = `$${price}`;
    }
  }

  parentDiv.appendChild(newDiv);

  // Create a link icon with a href
  const link = document.createElement('a');
  link.href = `https://t.sih-db.com/15GzoA?subid1=%2Fmarket%2Fcsgo%23tab%3Dselling%26page_num%3D1%26search%3D${formatItem(item)}&subid2=buff163-side-menu`;
  link.target = '_blank';
  link.innerHTML = '<mat-icon _ngcontent-ele-c200="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font">link</mat-icon>';
  link.style.marginLeft = '10px';
  parentDiv.appendChild(link);

  ngStarInsertedDiv.parentNode.insertBefore(parentDiv, ngStarInsertedDiv.nextSibling);
}

setInterval(() => {
  const cdkOverlayContainer = document.querySelector('.cdk-overlay-container');

  if (cdkOverlayContainer && cdkOverlayContainer.children.length > 0 && !cdkOverlayContainer.querySelector('#buff-price')) {
    copyAndPasteItemName();
  }
}, 1000);

chrome.runtime.sendMessage({ action: 'getSettings' }, function (response) {
  settings = {
    enableStickers: response.enableStickers || true,
    profitColor: response.profitColor || '#00FF00',
    lossColor: response.lossColor || '#FF0000',
    neutralColor: response.neutralColor || '#FFA500',
    sihToken: response.sihToken || '',
  }
});
