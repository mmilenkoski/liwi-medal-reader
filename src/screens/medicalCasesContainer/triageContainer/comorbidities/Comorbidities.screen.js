// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text } from 'native-base';
import { ScrollView } from 'react-native';

type Props = NavigationScreenProps & {};

type State = {};

export default class Comorbidities extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    return (
      <ScrollView>
        <Text>Comorbidities</Text>
      </ScrollView>
    );
  }
}
