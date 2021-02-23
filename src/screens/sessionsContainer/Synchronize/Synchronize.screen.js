// @flow
import * as React from 'react';
import { Button, Text, View } from 'native-base';
import { PermissionsAndroid, ScrollView } from 'react-native';

import * as NetInfo from '@react-native-community/netinfo';
import { styles } from './Synchronize.style';
import LiwiLoader from '../../../utils/LiwiLoader';
import Database from '../../../engine/api/Database';

export default class Synchronize extends React.Component {
  state = {
    loading: false,
  };

  constructor(props) {
    super(props);
  }

  /**
   * Ask user to allow write in external storage
   * Not used actually
   * @returns {Promise<*>}
   * @private
   */
  _askWriteStorage = async () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  };

  /**
   * Get group, algorithm and store it in local storage
   * @returns {Promise<void>}
   */
  createSession = async () => {
    const writePermission = await this._askWriteStorage();

    if (writePermission) {
      this.setState({ loading: true });

      const { app, navigation } = this.props;
      const result = await app.setInitialData();

      if (result !== null) {
        this.setState({ loading: false });
        const database = await new Database();
        await app.set('database', database);
        navigation.navigate('About', { source: 'synchronize' });
      }
    }
  };

  render() {
    const {
      app: { t },
    } = this.props;
    const { loading } = this.state;

    // Internet connection status
    const netInfoConnection = NetInfo.fetch();
    const { isConnected } = netInfoConnection;

    return (
      <ScrollView>
        <View testID="UnLockSession" style={styles.flex}>
          <View flex-container-column>
            <View margin-auto padding-auto style={styles.flex}>
              <View style={styles.bloc}>
                {loading ? (
                  <LiwiLoader />
                ) : (
                  <>
                    <Text bigTitle noBorder>
                      {t('unlock_session:title')}
                    </Text>
                    <Text size-auto>{t('unlock_session:assign')}</Text>
                    <Button onPress={this.createSession} disabled={isConnected} testID="new_session" style={styles.buttonSync}>
                      <Text size-auto>{t('unlock_session:sync_group')}</Text>
                    </Button>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
