async function getBuffPrice(itemName, itemDetails) {
  try {
    const req = await fetch("http://localhost:3000/buff", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ itemName, itemDetails })
    });
    const res = await req.json();
    return res?.price;
  } catch (err) {
    console.log(err);
    return null;
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