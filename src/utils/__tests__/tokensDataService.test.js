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

import deltaTokens from 'utils/__tests__/delta';
import unnecessaryTokens from 'utils/__tests__/removeThisTokens';

import _finalTokensList from 'utils/__tests__/finalTokensList';

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

//

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

  const tokens = erc20Icons;
  tokens.forEach(async (token) => {
    await fs
      .createReadStream(`token_logo_black_128/${token}.png`)
      .pipe(sharp().resize(32, 32))
      .pipe(fs.createWriteStream(`newTokens/${token}.png`));
  });

  tokens.forEach(async (token) => {
    await fs
      .createReadStream(`token_logo_color_128/${token}.png`)
      .pipe(sharp().resize(32, 32))
      .pipe(fs.createWriteStream(`newTokens/${token}Color.png`));
  });
});

it.skip('should remove unnecessary tokens', () => {
  console.log('tokens', deltaTokens.length);

  const finalTokensList = deltaTokens.filter(token => !unnecessaryTokens.includes(token.symbol));

  console.log('finalTokensList', finalTokensList.length);

  fs.writeFile('finalTokensList.json', JSON.stringify(finalTokensList));
});

it.skip('should prepare data for BE', () => {
  const finalTokensList = _finalTokensList.map(item => {
    return {
      address: item.address,
      decimals: item.decimals,
      description: item.description || null,
      name: item.name,
      symbol: item.symbol,
      wallpaperUrl: item.wallpaperUrl || null,
      iconUrl: item.iconUrl || null,
      iconMonoUrl: item.iconMonoUrl || null,
      email: item.email || null,
      telegram: item.telegram || null,
      twitter: item.twitter || null,
      website: item.website || null,
      whitepaper: item.whitepaper || null,
      isDefault: item.isDefault || false,
      isPreferred: item.isPreferred || false,
    };
  });

  console.log('finalTokensList', finalTokensList.length);
  fs.writeFile('_finalTokensList.json', JSON.stringify(finalTokensList));
});
