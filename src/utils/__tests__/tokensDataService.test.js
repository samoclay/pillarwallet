// @flow
import {
  downloadLinksToEtherscan,
  downloadDataFromEtherscan,
} from 'utils/tokensDataService';
import coinMarketCapEthTokens from 'utils/__tests__/coinMarketCapEthTokens';
import coinMarketCapEthTokensWithLinks from 'utils/__tests__/coinMarketCapEthTokensWithLinks';
import coinMarkerCapTokensInfoMapBySymbol from 'utils/__tests__/coinMarkerCapTokensInfoMapBySymbol';
import dataFromEtherscan from 'utils/__tests__/dataFromEtherscan';

const fs = require('fs');

it.skip('should downloadLinksToEtherscan() and write to file', async () => {
  jest.setTimeout(3000000);

  const tokens = coinMarketCapEthTokens.slice(0, 10);
  await downloadLinksToEtherscan(tokens);
});

it.skip('should downloadDataFromEtherscan() and write to file', async () => {
  jest.setTimeout(3000000);

  const tokens = coinMarketCapEthTokensWithLinks.slice(0, coinMarketCapEthTokensWithLinks.length);
  await downloadDataFromEtherscan(tokens);
});

it.skip('should write assets.json', () => {
  const tokensMetadata = coinMarkerCapTokensInfoMapBySymbol;
  const tokens = dataFromEtherscan.map((token) => {
    const metadata = tokensMetadata[token.symbol];
    return {
      address: token.address,
      decimals: parseInt(token.decimals, 10),
      description: token.description,
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
      whitepaper: null,
    };
  });

  fs.writeFile('assets.json', JSON.stringify(tokens));
});
