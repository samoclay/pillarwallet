// @flow

/**
 * It is a Service to get data from CoinMarketCap and Etherscan.
 * This solution is TEMPORARY and should be merged NEVER!
 * Maybe we will create a separate project in future.
 */

const axios = require('axios');
const fs = require('fs');

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  /**
   * You should register on https://pro.coinmarketcap.com to get this key.
   * You need CoinMarketCap to get the token's data and metadata.
   */
  'X-CMC_PRO_API_KEY': '', //
};

function sleep(milliseconds) {
  const start = new Date().getTime();
  while (true) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

// Read: https://pro.coinmarketcap.com/api/v1#operation/getV1CryptocurrencyMap
export const findList = async () => {
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';
  const config = {
    headers: { ...defaultHeaders },
  };

  try {
    return await axios.get(url, config);
  } catch (e) {
    console.log(e);
    return [];
  }
};

// Read: https://pro.coinmarketcap.com/api/v1#operation/getV1CryptocurrencyInfo
export const findTokensInfoByIds = (id: string) => {
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info';
  const config = {
    headers: { ...defaultHeaders },
    params: { id },
  };

  return axios.get(url, config);
};

/**
 * @param tokens
 * @param start
 * @param end
 * @returns {*}
 */
export const buildIdQuery = (tokens: Object[], start: number, end: number) => {
  return tokens
    .slice(start, end)
    .map(token => token.id)
    .join(',');
};

/**
 * @param tokens
 * @param tokensInRequest
 * @returns {Promise<void>}
 *
 * This method:
 * - build a query from the tokens ids;
 * - get metadata for one or more cryptocurrencies;
 * - save result to file.
 */
export const findTokensInfo = async (tokens: Object[], tokensInRequest: number = 100) => {
  const requestsCount = Math.ceil(tokens.length / tokensInRequest);
  const requestPromiseList = [];

  for (let i = 0; i < requestsCount; i++) {
    const idsQuery = buildIdQuery(tokens, i * tokensInRequest, (i + 1) * tokensInRequest);
    requestPromiseList.push(findTokensInfoByIds(idsQuery));
  }

  const responses = await Promise.all(requestPromiseList);
  const tokensMap = {};

  responses.forEach((res) => Object.assign(tokensMap, res.data.data));

  fs.writeFile('coinMarkerCapTokensInfoMapById.json', JSON.stringify(tokensMap));
};

/**
 * @param tokensMap
 *
 * This method:
 * - convert tokens map where an id is a key to the map where a symbol is a key;
 * - save result to file.
 */
export const toTokensInfoMapWithSymbolKey = (tokensMap: Object) => {
  const resultTokensMap = {};
  Object.values(tokensMap).forEach(token => {
    // $FlowFixMe
    resultTokensMap[token.symbol] = token;
  });

  fs.writeFile('coinMarkerCapTokensInfoMapBySymbol.json', JSON.stringify(resultTokensMap));
};

/**
 * @param url
 * @returns {Promise<*>}
 */
export const getLinkToEtherscan = async (url: string) => {
  const res = await axios.get(url);
  const regexp = /https?:\/\/etherscan.io\/token\/[A-Za-z0-9]+/gm;
  const result = regexp.exec(res.data);
  return result ? result[0] : null;
};

/**
 * @param url
 * @returns {Promise<{address: (*|string), decimals: string}>}
 */
export const getDataFromEtherscan = async (url: string) => {
  const res = await axios.get(url);
  const html = res.data
    .replace(/(\r\n\t|\n|\r\t)/gm, '')
    .replace(/\s\s+/g, ' ');

  // Get Decimal
  const decimalsTr = /<tr id="ContentPlaceHolder1_trDecimals".*<tr id="ContentPlaceHolder1_tr_officialsite_2"/gm.exec(html)[0]; // eslint-disable-line max-len
  const decimals = (/[0-9]+</gm.exec(decimalsTr)[0]).slice(0, -1);

  // Get Address
  const addressTr = /('|")\/address\/0x[A-Za-z0-9]{40}('|")/gm.exec(html)[0];
  const address = /0x[A-Za-z0-9]{40}/gm.exec(addressTr)[0];

  // Get Description
  let description = '';
  const descriptionMatch = /OVERVIEW<\/strong><\/p>.+<br><br><p>/gm.exec(html);
  if (descriptionMatch) {
    const descriptionTr = descriptionMatch[0];
    description = descriptionTr.slice(21, -11);
  }

  // Get Total Supply
  let totalSupply = '0';
  const totalSupplyMatch = /[0-9]+,[0-9,]{3,}(<b>.<\/b>[.0-9]+)? /gm.exec(html);
  if (totalSupplyMatch) {
    const totalSupplyStr = totalSupplyMatch[0];
    totalSupply = totalSupplyStr
      .replace(' ', '')
      .replace('<b>', '')
      .replace('</b>', '');
  }

  return {
    address,
    decimals,
    description,
    totalSupply,
  };
};

export const downloadLinksToEtherscan = async (tokens: Object[]) => {
  const reachedTokens = [];

  for (let counter = 0; counter < tokens.length;) {
    const token = tokens[counter];
    console.log('token: ', counter, token.name);

    try {
      const linkToEtherscan = await getLinkToEtherscan(token.url); // eslint-disable-line no-await-in-loop
      if (linkToEtherscan) {
        const reachedToken = {
          ...token,
          linkToEtherscan,
        };
        reachedTokens.push(reachedToken);
      }
      counter++;
      sleep(1000);
    } catch (e) {
      console.log('!!! PAUSE !!!');
      sleep(10000);
    }
  }

  fs.writeFile('coinMarketCapEthTokensWithLinks.json', JSON.stringify(reachedTokens));
};

export const downloadDataFromEtherscan = async (tokens: Object[]) => {
  const reachedTokens = [];

  for (let counter = 0; counter < tokens.length;) {
    const token = tokens[counter];
    console.log('token: ', counter, token.name);

    try {
      const etherscanData = await getDataFromEtherscan(token.linkToEtherscan); // eslint-disable-line no-await-in-loop
      const reachedToken = {
        name: token.name,
        symbol: token.symbol,
        ...etherscanData,
      };
      reachedTokens.push(reachedToken);
      counter++;
    } catch (e) {
      console.log('!!! PAUSE !!!');
      console.log(e);
      sleep(4000);
    }
  }

  fs.writeFile('dataFromEtherscan.json', JSON.stringify(reachedTokens));
};
