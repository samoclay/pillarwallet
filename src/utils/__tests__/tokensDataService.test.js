// @flow
import {
  downloadLinksToEtherscan,
  downloadDataFromEtherscan,
} from 'utils/tokensDataService';
import coinMarketCapEthTokens from 'utils/__tests__/coinMarketCapEthTokens';
import coinMarketCapEthTokensWithLinks from 'utils/__tests__/coinMarketCapEthTokensWithLinks';

it.skip('should getLinkToEtherscan() and write to file', async () => {
  jest.setTimeout(3000000);

  const tokens = coinMarketCapEthTokens.slice(0, 10);
  await downloadLinksToEtherscan(tokens);
});

it.skip('should getDataFromEtherscan() and write to file', async () => {
  jest.setTimeout(3000000);

  const tokens = coinMarketCapEthTokensWithLinks.slice(0, 10);
  await downloadDataFromEtherscan(tokens);
});
