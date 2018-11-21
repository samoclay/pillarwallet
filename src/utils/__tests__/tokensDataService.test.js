// @flow
import {
  downloadLinksFromCoinmarketcap,
  downloadDataFromEtherscan,
} from 'utils/tokensDataService';
import coinMarketCapEthTokens from 'utils/__tests__/coinMarketCapEthTokens';
import coinMarketCapEthTokensWithLinks from 'utils/__tests__/coinMarketCapEthTokensWithLinks';
import coinMarkerCapTokensInfoMapBySymbol from 'utils/__tests__/coinMarkerCapTokensInfoMapBySymbol';
import dataFromEtherscan from 'utils/__tests__/dataFromEtherscan';
import defaultAssets from 'utils/__tests__/defaultAssets';
import iconsList from 'utils/__tests__/iconsList';
import tokensIcons from 'utils/__tests__/tokensIcons';
import erc20Icons from 'utils/__tests__/erc20Icons';

const fs = require('fs');
const sharp = require('sharp');

const toFinalToken = (token) => {
  const tokensMetadata = coinMarkerCapTokensInfoMapBySymbol;
  const tokensWithLinks = coinMarketCapEthTokensWithLinks;

  const { symbol } = token;
  const metadata = tokensMetadata[symbol];
  const tokenWithLinks = tokensWithLinks.find(item => item.symbol === symbol);
  const whitepaper = tokenWithLinks ? tokenWithLinks.whitepaper || '' : '';

  let iconUrl = null;
  let iconMonoUrl = null;

  const iconName = symbol.toLocaleLowerCase();
  if (iconsList.includes(iconName)) {
    iconUrl = `asset/images/tokens/icons/${iconName}Color.png`;
    iconMonoUrl = `asset/images/tokens/icons/${iconName}.png`;
  }

  return {
    address: token.address,
    decimals: parseInt(token.decimals, 10),
    description: token.description || 'N/A',
    email: null,
    iconMonoUrl,
    iconUrl,
    isDefault: false,
    isPreferred: false,
    name: token.name,
    symbol: token.symbol,
    telegram: null,
    twitter: metadata.urls.twitter[0] || null,
    wallpaperUrl: null,
    website: metadata.urls.website[0] || null,
    whitepaper: whitepaper || null,

    // totalSupply: token.totalSupply, // just for BCX team
  };
};

const findDefaultSymbols = () => {
  return defaultAssets.map(item => item.symbol.toLocaleLowerCase());
};

const getDataFromEtherscanMap = () => {
  const dataFromEtherscanMap = {};
  dataFromEtherscan.forEach(token => {
    dataFromEtherscanMap[token.symbol.toLowerCase()] = token;
  });
  return dataFromEtherscanMap;
};

const findDeltaSymbols = () => {
  const defaultSymbols = findDefaultSymbols();
  return iconsList.filter(item => !defaultSymbols.includes(item));
};

it.skip('should downloadLinksFromCoinmarketcap() and write to file', async () => {
  jest.setTimeout(3000000);

  const tokens = coinMarketCapEthTokens;
  await downloadLinksFromCoinmarketcap(tokens);
});

it.skip('should downloadDataFromEtherscan() and write to file', async () => {
  jest.setTimeout(3000000);

  const tokens = coinMarketCapEthTokensWithLinks;
  await downloadDataFromEtherscan(tokens);
});

it.skip('should write assets.json', () => {
  const tokens = dataFromEtherscan.map(token => toFinalToken(token));
  fs.writeFile('assets.json', JSON.stringify(tokens));
});

it.skip('should get delta icons', () => {
  const dataFromEtherscanMap = {};
  dataFromEtherscan.forEach(token => {
    dataFromEtherscanMap[token.symbol.toLowerCase()] = token;
  });

  const tokens = findDeltaSymbols().map(symbol => {
    return toFinalToken(dataFromEtherscanMap[symbol]);
  });
  console.log('delta icons:', tokens.length); // eslint-disable-line
  fs.writeFile('delta.json', JSON.stringify(tokens));
});

// DELTA
it.skip('should write just new tokens to delta.json', () => {
  const defaultSymbols = findDefaultSymbols();
  const filteredDataFromEtherscan = dataFromEtherscan
    .filter(asset => !defaultSymbols.includes(asset.symbol.toLowerCase()));

  const tokens = filteredDataFromEtherscan.map(token => {
    return toFinalToken(token);
  });

  console.log('new tokens:', tokens.length);

  fs.writeFile('delta.json', JSON.stringify(tokens));
});

it.skip('should ...', () => {
  const dataFromEtherscanMap = getDataFromEtherscanMap();

  const tokens = defaultAssets.map(asset => {
    const data = dataFromEtherscanMap[asset.symbol.toLowerCase()];
    const totalSupply = data ? data.totalSupply : null;
    return {
      ...asset,
      totalSupply,
    };
  });

  fs.writeFile('_tokens.json', JSON.stringify(tokens));
});

it.skip('should return ERC20 icons', () => {
  const marketEthTokens = coinMarketCapEthTokens.map(token => token.symbol.toLocaleLowerCase());
  const defaultEthTokens = defaultAssets.map(token => token.symbol.toLocaleLowerCase());
  const ethTokens = marketEthTokens.concat(defaultEthTokens);

  const erc20IconsList = tokensIcons.filter(icon => ethTokens.includes(icon));
  fs.writeFile('erc20Icons.json', JSON.stringify(erc20IconsList));
});

it.skip('should copy icons', () => {
  const tokens = erc20Icons;
  tokens.forEach(token => fs
    .createReadStream(`token_logo_black_128/${token}.png`)
    .pipe(fs.createWriteStream(`newTokens/${token}@3x.png`)),
  );
  tokens.forEach(token => fs
    .createReadStream(`token_logo_color_128/${token}.png`)
    .pipe(fs.createWriteStream(`newTokens/${token}Color@3x.png`)),
  );
});

it.skip('should save 64x64 resized icons x2', async () => {
  jest.setTimeout(3000000);

  const tokens = erc20Icons;
  tokens.forEach(async (token) => {
    await fs
      .createReadStream(`token_logo_black_128/${token}.png`)
      .pipe(sharp().resize(64, 64))
      .pipe(fs.createWriteStream(`newTokens/${token}@2x.png`));
  });

  tokens.forEach(async (token) => {
    await fs
      .createReadStream(`token_logo_color_128/${token}.png`)
      .pipe(sharp().resize(64, 64))
      .pipe(fs.createWriteStream(`newTokens/${token}Color@2x.png`));
  });
});

it.skip('should save 32x32 icons', async () => {
  jest.setTimeout(3000000);

  const tokens = findDeltaSymbols();
  tokens.forEach(async (token) => {
    await fs
      .createReadStream(`token_logo_black_128/${token}.png`)
      .pipe(sharp().resize(32, 32))
      .pipe(fs.createWriteStream(`newTokensResized/${token}.png`));
  });

  tokens.forEach(async (token) => {
    await fs
      .createReadStream(`token_logo_color_128/${token}.png`)
      .pipe(sharp().resize(32, 32))
      .pipe(fs.createWriteStream(`newTokensResized/${token}Color.png`));
  });
});
