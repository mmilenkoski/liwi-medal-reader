// @flow

import * as React from 'react';
import AppNavigator from 'engine/navigation/Root.navigation';
import { createAppContainer } from 'react-navigation';
import getTheme from 'template/liwi/native_components/index.ignore';
import material from 'template/liwi/variables/material';
import liwi from 'template/liwi/styles';
import merge from 'deepmerge';
import { RootView } from 'template/layout';
import { Platform, StatusBar } from 'react-native';
import { Container, Root, StyleProvider } from 'native-base';
import { withApplication } from '../engine/contexts/Application.context';
import NavigationService from '../engine/navigation/Navigation.service';
import LiwiLoader from '../utils/LiwiLoader';
import { getItem, setItem } from '../engine/api/LocalStorage';
import { appInBackgroundStateKey, navigationStateKey } from '../../frontend_service/constants';

type Props = {
  app: {
    logged: boolean,
    ready: boolean,
    appState: string,
    navigationState: Array,
  },
};

// eslint-disable-next-line no-unused-vars
const persistNavigationState = async (navState) => {
  try {
    await setItem(navigationStateKey, navState);
  } catch (err) {
    // handle the error according to your needs
  }
};

class LayoutTemplate extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props): boolean {
    return nextProps.app.appState !== 'background';
  }

  loadNavigationState = async () => {
    const state = await getItem(navigationStateKey);
    const fromBackground = await getItem(appInBackgroundStateKey);
    const {
      app: { appState },
    } = this.props;

    let routes = null;
    // If the app come not from the background
    // the item is set in app.contexte
    if (fromBackground === null && appState === 'active') {
      // first render of the app
      return null;
    }
    // If we have to catch the moment when the app go into background
    // } else if (fromBackground === null && appState === 'background') {
    // }
    else if (fromBackground && appState === 'active') {
      routes = state;
      const { app } = this.props;
      // This fix a bug when we reload the app in the setcodesession screen
      if (routes !== null && routes.routes[routes.index].key === 'SetCodeSession' && app.logged === true) {
        routes = null;
      }
      // Set the flag background
      await setItem(appInBackgroundStateKey, null);
      return routes;
    }
  };

  render() {
    const {
      app: { logged, ready },
    } = this.props;

    // Constant used in app
    const Navigator = AppNavigator(logged);
    const AppContainer = createAppContainer(Navigator);
    const baseTheme = getTheme(material);
    const theme = merge(baseTheme, liwi);

    return (
      <Root>
        <StyleProvider style={theme}>
          {ready ? (
            <Container>
              <RootView>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                <AppContainer
                  persistNavigationState={persistNavigationState}
                  loadNavigationState={this.loadNavigationState}
                  renderLoadingExperimental={() => <LiwiLoader />}
                  ref={(navigatorRef) => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                  }}
                  onNavigationStateChange={NavigationService.onNavigationStateChange}
                />
              </RootView>
            </Container>
          ) : (
            <LiwiLoader />
          )}
        </StyleProvider>
      </Root>
    );
  }
}

export default withApplication(LayoutTemplate);
