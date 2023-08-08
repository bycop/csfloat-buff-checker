## CSFloat - Buff prices checker [API]

### Installation
- For this api you'll need to have node.js installed (https://nodejs.org/fr)
- When you've nodejs installed, copy the path where the `api` folder is located in your explorer
- Open a `cmd.exe` (Win + R > cmd.exe)
- Write `cd path/to/api` and press enter
- Then run these two commands:

```sh
npm install
```

### Start the api
```sh
npm run start
```

### Use https version [OPTIONAL]
Add these 2 things
```ts
import * as fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('./secrets/private.key'),
  cert: fs.readFileSync('./secrets/public.cer'),
};
```
```ts
  const app = await NestFactory.create(AppModule, {
    httpOptions
  });
```

in your `src/main.ts` and edit the api calls from extension files (More info in the README.md in the `extension` folder)

### Support
You like this work and you want to help me hosting my projects ? Feel free to Buy me a Coffee

<a href="https://www.buymeacoffee.com/bycop" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

