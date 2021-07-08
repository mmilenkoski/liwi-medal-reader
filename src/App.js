import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { View, Text } from 'react-native'
import { PersistGate } from 'redux-persist/lib/integration/react'
import FlashMessage from 'react-native-flash-message'
import Appsignal from '@appsignal/javascript'
import { ErrorBoundary } from '@appsignal/react'

const appsignal = new Appsignal({ key: '9c0f7538-551f-41a5-b331-864ba2e04705' })
const FallbackComponent = error => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 20, color: 'white' }}>AN ERROR OCCURED</Text>
    <Text style={{ fontSize: 18, color: 'white' }}>
      {JSON.stringify(error)}
    </Text>
  </View>
)

import { store, persistor } from '@/Store'
import { ApplicationNavigator } from '@/Navigators'

import './Translations'

const App = () => {
  return (
    <ErrorBoundary
      instance={appsignal}
      fallback={error => <FallbackComponent />}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationNavigator />
          <FlashMessage
            position="top"
            floating={true}
            icon="auto"
            titleStyle={{
              fontFamily: 'ZeitungPro-Bold',
            }}
            textStyle={{ fontFamily: 'ZeitungPro', fontSize: 18 }}
          />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
