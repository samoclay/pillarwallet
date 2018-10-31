// @flow
import * as React from 'react';

import type { NavigationScreenProp } from 'react-navigation';
import { SECURITY_CONFIRM, IMPORT_WALLET } from 'constants/navigationConstants';
import { Container, Wrapper, Footer } from 'components/Layout';
import Header from 'components/Header';
import { Paragraph } from 'components/Typography';
import Button from 'components/Button';
import { testHookHeader, testHookButton, testHookParagraph } from '../../testUtils/testHook';

type Props = {
  navigation: NavigationScreenProp<*>,
};

class Onboarding extends React.Component<Props> {
  createNewWallet = () => {
    this.props.navigation.navigate(SECURITY_CONFIRM);
  };

  importOldWallet = () => {
    this.props.navigation.navigate(IMPORT_WALLET);
  };

  render() {
    return (
      <Container>
        <Header {...testHookHeader('Welcome')} title="welcome" onBack={() => this.props.navigation.goBack(null)} />
        <Wrapper regularPadding>
          <Paragraph {...testHookParagraph()}>Pillar is a next-generation digital wallet
            and application for personal data management.
          </Paragraph>
        </Wrapper>
        <Footer>
          <Button {...testHookButton('SetupNewWallet')} block marginBottom="20px" marginTop="20px" onPress={this.createNewWallet} title="Setup New Wallet" />
          <Button {...testHookButton('ImportWallet')} block onPress={this.importOldWallet} secondary title="Import Wallet" />
        </Footer>
      </Container>
    );
  }
}
export default Onboarding;
