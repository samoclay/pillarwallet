// @flow
import * as React from 'react';
import { Platform, TouchableOpacity, TouchableNativeFeedback, View } from 'react-native';
import styled from 'styled-components/native';
import { BaseText } from 'components/Typography';
import { fontSizes } from 'utils/variables';
import { testHook } from '../../testUtils/testHook';

type Props = {
  buttonText: string,
  onPress: Function,
  fontSize?: number,
  testHookId?: string,
}

const ButtonLabel = styled(BaseText)`
  font-size: ${fontSizes.extraSmall};
  color: rgb(32,119,253);
`;

const ButtonText = (props: Props) => {
  const { buttonText, onPress } = props;
  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacity {...testHook(props.testHookId)} onPress={onPress}>
        <ButtonLabel>{buttonText}</ButtonLabel>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableNativeFeedback
      {...testHook(props.testHookId)}
      onPress={onPress}
      background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
    >
      <View style={{
        alignSelf: 'center',
        margin: 0,
      }}
      >
        <ButtonLabel {...testHook('ButtonLabel')}>{buttonText}</ButtonLabel>
      </View>
    </TouchableNativeFeedback>
  );
};

export default ButtonText;
