// $FlowIgnore
/* eslint-disable */
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
  'Class RCTCxxModule',
  'Module RNRandomBytes',
  'Module RNOS',
  'Module RNFetchBlob',
  'Module Intercom',
  'Class EX'
]);
if (__DEV__) {
  console.disableYellowBox = true;
}
import 'utils/shim';
import'crypto';
