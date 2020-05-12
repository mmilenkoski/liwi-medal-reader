// @flow

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import KeepAwake from "react-native-keep-awake";
import { ApplicationProvider } from "./engine/contexts/Application.context";

import WavemindTools from "./utils/WavemindTools";
import { persistor, store } from "../frontend_service/store";
import CustomModal from "./components/CustomModal";
import { getItem } from "./engine/api/LocalStorage";

import Layout from "./template/Layout.template";
import TooltipModal from "./components/ToolTipModal";
import StatusIndicator from "./components/StatusIndicator";

export default class Root extends React.Component {
  async componentDidMount() {
    const settings = await getItem('settings');
    if (settings !== null && settings.app !== undefined && settings.app.awake) {
      KeepAwake.activate();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationProvider>
            <Layout />
            <CustomModal />
            <TooltipModal />
            {__DEV__ ? <WavemindTools /> : null}
            <StatusIndicator />
          </ApplicationProvider>
        </PersistGate>
      </Provider>
    );
  }
}
