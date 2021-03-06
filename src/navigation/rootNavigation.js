// @flow
/*
    Pillar Wallet: the personal data locker
    Copyright (C) 2019 Stiftung Pillar Project

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
import type { SwitchNavigator as SwitchNavigatorType } from 'react-navigation';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

// screens
import OnboardingScreen from 'screens/Onboarding';
import NewWalletScreen from 'screens/NewWallet';
import NewProfileScreen from 'screens/NewProfile';
import SecurityConfirmScreen from 'screens/SecurityConfirm';
import BackupPhraseScreen from 'screens/BackupPhrase';
import BackupPhraseValidateScreen from 'screens/BackupPhraseValidate';
import LegalTermsScreen from 'screens/LegalTerms';
import ImportWalletScreen from 'screens/ImportWallet';
import SetWalletPinCodeScreen from 'screens/SetWalletPinCode';
import PinCodeConfirmationScreen from 'screens/PinCodeConfirmation';
import PinCodeUnlockScreen from 'screens/PinCodeUnlock';
import WelcomeScreen from 'screens/Welcome';
import ForgotPinScreen from 'screens/ForgotPin';

import { modalTransition } from 'utils/common';

import {
  APP_FLOW,
  ONBOARDING_FLOW,
  AUTH_FLOW,
  SECURITY_CONFIRM,
  BACKUP_PHRASE,
  BACKUP_PHRASE_VALIDATE,
  SET_WALLET_PIN_CODE,
  NEW_WALLET,
  NEW_PROFILE,
  LEGAL_TERMS,
  IMPORT_WALLET,
  PIN_CODE_CONFIRMATION,
  PIN_CODE_UNLOCK,
  ONBOARDING_HOME,
  WELCOME,
  FORGOT_PIN,
} from 'constants/navigationConstants';

import AppFlow from './appNavigation';

const StackNavigatorConfig = {
  navigationOptions: {
    header: null,
    gesturesEnabled: true,
  },
};

const onBoardingFlow = createStackNavigator({
  [WELCOME]: {
    screen: WelcomeScreen,
    navigationOptions: {
      header: null,
    },
  },
  [ONBOARDING_HOME]: OnboardingScreen,
  [NEW_WALLET]: {
    screen: NewWalletScreen,
    navigationOptions: {
      header: null,
    },
  },
  [IMPORT_WALLET]: ImportWalletScreen,
  [SECURITY_CONFIRM]: SecurityConfirmScreen,
  [BACKUP_PHRASE]: BackupPhraseScreen,
  [BACKUP_PHRASE_VALIDATE]: BackupPhraseValidateScreen,
  [SET_WALLET_PIN_CODE]: SetWalletPinCodeScreen,
  [PIN_CODE_CONFIRMATION]: PinCodeConfirmationScreen,
  [NEW_PROFILE]: NewProfileScreen,
  [LEGAL_TERMS]: LegalTermsScreen,
}, StackNavigatorConfig);

const authFlow = createStackNavigator({
  [PIN_CODE_UNLOCK]: PinCodeUnlockScreen,
  [FORGOT_PIN]: ForgotPinScreen,
}, modalTransition);

const RootSwitch: SwitchNavigatorType = createSwitchNavigator({
  [ONBOARDING_FLOW]: onBoardingFlow,
  [AUTH_FLOW]: authFlow,
  [APP_FLOW]: AppFlow,
});

export default RootSwitch;
