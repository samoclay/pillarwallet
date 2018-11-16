// @flow
import {
  downloadLinksFromCoinmarketcap,
  downloadDataFromEtherscan,
} from 'utils/tokensDataService';
import coinMarketCapEthTokens from 'utils/__tests__/coinMarketCapEthTokens';
import coinMarketCapEthTokensWithLinks from 'utils/__tests__/coinMarketCapEthTokensWithLinks';
import coinMarkerCapTokensInfoMapBySymbol from 'utils/__tests__/coinMarkerCapTokensInfoMapBySymbol';
import dataFromEtherscan from 'utils/__tests__/dataFromEtherscan';

const fs = require('fs');

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
  const tokensMetadata = coinMarkerCapTokensInfoMapBySymbol;
  const tokensWithLinks = coinMarketCapEthTokensWithLinks;
  const tokens = dataFromEtherscan.map((token) => {
    const metadata = tokensMetadata[token.symbol];
    const tokenWithLinks = tokensWithLinks.find(item => item.symbol === token.symbol);
    const whitepaper = tokenWithLinks ? tokenWithLinks.whitepaper || '' : '';

    return {
      address: token.address,
      decimals: parseInt(token.decimals, 10),
      description: token.description || null,
      email: null,
      iconMonoUrl: null,
      iconUrl: null,
      isDefault: false,
      isDefaultToken: false,
      name: token.name,
      symbol: token.symbol,
      telegram: null,
      twitter: metadata.urls.twitter[0] || null,
      wallpaperUrl: null,
      website: metadata.urls.website[0] || null,
      whitepaper,
      totalSupply: token.totalSupply,
    };
  });

  fs.writeFile('assets.json', JSON.stringify(tokens));
});
