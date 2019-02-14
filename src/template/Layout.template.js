// @flow

import * as React from 'react';
import AppNavigator from 'engine/navigation/Root.navigation';

import {
  AppState,
  NetInfo,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Container, Root, StyleProvider } from 'native-base';
import getTheme from 'template/liwi/native_components/index.ignore';
import material from 'template/liwi/variables/material';
import liwi from 'template/liwi/styles';
import merge from 'deepmerge';
import { RootView } from 'template/layout';
import { withApplication } from '../engine/contexts/Application.context';
import { withSessions } from 'engine/contexts/Sessions.context';
import { connect } from 'react-redux';

type Props = {
  app: {
    logged: boolean,
  },
};

const mapStateToProps = (medicalCase, ownProps) => {
  return {
    medicalCase,
  };
};

class LayoutTemplate extends React.Component<Props> {
  state = {
    appState: AppState.currentState,
  };

  // shouldComponentUpdate(
  //   nextProps: Readonly<P>,
  //   nextState: Readonly<S>,
  //   nextContext: any
  // ): boolean {
  //   console.log(this.props, nextProps);
  //   console.log(
  //     this.props.medicalCase.id === undefined,
  //     nextProps.medicalCase.id !== this.props.medicalCase.id
  //   );
  //
  //   if (
  //     this.props.medicalCase.id === undefined ||
  //     nextProps.medicalCase.id !== this.props.medicalCase.id
  //   ) {
  //     return true;
  //   }
  // }

  render() {
    const {
      app: { logged },
      medicalCase,
    } = this.props;

    const Navigator = AppNavigator(logged, medicalCase);
    const AppContainer = createAppContainer(Navigator);
    const baseTheme = getTheme(material);
    const theme = merge(baseTheme, liwi);

    return (
      <Root>
        <StyleProvider style={theme}>
          <Container>
            <RootView>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppContainer />
            </RootView>
          </Container>
        </StyleProvider>
      </Root>
    );
  }
}

// export default connect(mapStateToProps)(withApplication(LayoutTemplate));
export default withApplication(LayoutTemplate);
