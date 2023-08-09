import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface Item {
  name: string;
  quality: string;
  special: string;
  details: string;
  star: boolean;
}

@Injectable()
export class AppService {
  parseItem(name: string, details: string): Item {

    const item: Item = {
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

  formatItem(item: Item): string {
    if (item.details && item.details.endsWith("Sticker")) {
      return `Sticker | ${item.name}`;
    }

    return `${item.star ? "★ " : ""}${item.special ? item.special + " " : ""}${item.name}${item.quality !== "Not painted" ? ` (${item.quality})` : ''}`;
  }

  async getBuffPrice(itemName, itemDetails): Promise<string | number> {
    const item = this.parseItem(itemName, itemDetails);
    const name = this.formatItem(item);

    const response = await axios.post('https://api.steaminventoryhelper.com/v2/live-prices/getPrices', {
      "appId": "730",
      "markets": ["buff163"],
      "items": [name]
    });

    return response.data?.items[name]?.buff163?.price || "N/A";
  }
}
