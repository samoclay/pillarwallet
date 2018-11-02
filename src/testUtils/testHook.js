
// @flow
import { Platform } from 'react-native';

const prefix: string = 'Hook';

export function testHook(id: string = '', suffix: string = '') {
  return __DEV__ ? { // do nothing if production release build
    testID: Platform.select({ ios: `${prefix}${id || ''}${suffix}`, android: undefined }),
    accessibilityLabel: Platform.select({ ios: undefined, android: `${prefix}${id || ''}${suffix}` }),
    testHookId: `${id || ''}${suffix}`,
  } : undefined;
}

export function testHookButton(id: string = '') {
  return testHook(id, 'Button');
}

export function testHookCheckbox(id: string = '') {
  return testHook(id, 'Checkbox');
}

export function testHookHeader(id: string = '') {
  return testHook(id, 'Header');
}

export function testHookHeaderInternal(id: string = '', suffix: string = '') {
  return testHook(id || 'Header', suffix);
}

export function testHookImage(id: string = '') {
  return testHook(id, 'Image');
}

export function testHookMnemonicPhrase() {
  return testHook('Mnemonic');
}

export function testHookParagraph(id: string = '') {
  return testHook(id, 'Paragraph');
}

export function testHookWordInputPrefix(id: string = '') {
  return testHook(id, 'WordInputPrefix');
}
