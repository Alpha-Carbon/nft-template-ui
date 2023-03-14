# NFT Template DApp Web UI

A demo of the [NFT Template Contract](https://github.com/Alpha-Carbon/nft-template-contract), which provides an interface for users to mint/burn their NFTs.

## Getting Started

First, run the development server:

```sh
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Fonts

Downloaded and CSS Injected via [this app](http://google-webfonts-helper.herokuapp.com/)

## Hosting

Currently using github pages.  To manually deploy:

```sh
yarn build
yarn export 
yarn deploy
```

Gotchas:
- Need custom ```next.config.js``` ```assetPrefix``` and ```basePath``` (and possible nav/link hacks)
- Need empty .nojekyll file in the generated ```out``` path when pushing to ```gh-pages``` branch
- Reference: [nextjs issue](https://github.com/vercel/next.js/issues/3335)

## Roadmap
🚧 = In Progress
⛑ = In Testing 

🚀 = Shipped!

| Feature | Status |
| ------- | :------: |
| Auctions | ⛑  |
| Web3 | ⛑  |
| Contract Functions | ⛑ |
| Assets | 🚧  |

