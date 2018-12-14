// @flow
import { SignalClient } from 'rn-signal-protocol-messaging';
import { SENTRY_DSN, SIGNAL_SERVER_HOST } from 'react-native-dotenv';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';


export default class Chat {
  client: Object;

  constructor() {
    this.client = SignalClient;
  }

  async init(credentials: Object) {
    if (Platform.OS === 'ios') {
      return this.client.createClient(
        credentials.username,
        credentials.password,
        SIGNAL_SERVER_HOST,
      );
    }

    credentials.errorTrackingDSN = SENTRY_DSN;
    credentials.isSendingLogs = !__DEV__;
    credentials.buildNumber = `${DeviceInfo.getBuildNumber()}`;
    credentials.device = `${DeviceInfo.getManufacturer()} ${DeviceInfo.getModel()}`;
    credentials.os = `${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`;
    credentials.host = SIGNAL_SERVER_HOST;
    return this.client.init(credentials);
  }
}
