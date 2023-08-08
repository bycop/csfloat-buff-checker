## CSFloat - Buff prices checker [API]

### Installation
```sh
npm install
```

### Usage
```sh
npm run start
```

### Use https version
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