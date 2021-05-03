import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Animated,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import Auth from '@/Store/System/Auth'
import ChangeTheme from '@/Store/Theme/ChangeTheme'

import { useTheme } from '@/Theme'
import { SquareButton } from '@/Components'

const IndexAuthContainer = props => {
  // Theme and style elements deconstruction
  const { Layout, Fonts, Colors } = useTheme()
  const dispatch = useDispatch()

  // Local state definition
  const [email, setEmail] = useState(
    __DEV__ ? 'quentin.girard@wavemind.ch' : '',
  )
  const [password, setPassword] = useState(__DEV__ ? '123456' : '')
  const [isEnabled, setIsEnabled] = useState(false)

  const authLoading = useSelector(state => state.system.auth.loading)
  const newSessionError = useSelector(state => state.user.newSession.error)
  const registerError = useSelector(state => state.device.register.error)
  const theme = useSelector(state => state.theme)

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  const handleLogin = () => {
    dispatch(Auth.action({ email, password }))
  }

  const changeTheme = ({ newTheme, darkMode }) => {
    dispatch(ChangeTheme.action({ theme: newTheme, darkMode }))
    setIsEnabled(!isEnabled)
  }

  return (
    <Animated.View style={[Layout.fill, Layout.center, { opacity: fadeAnim }]}>
      <Text style={[Fonts.textColorText, Fonts.titleSmall]}>
        Authentication
      </Text>
      <View style={[Layout.colVCenter, { width: 300 }]}>
        <TextInput
          style={{
            backgroundColor: 'white',
            height: 40,
            width: 300,
            marginTop: 12,
            borderWidth: 1,
            color: 'black',
            paddingHorizontal: 10,
          }}
          onChangeText={setEmail}
          value={email}
          autoCompleteType="email"
          placeholder="email"
        />
        <TextInput
          style={{
            backgroundColor: 'white',
            height: 40,
            width: 300,
            marginVertical: 12,
            borderWidth: 1,
            color: 'black',
            paddingHorizontal: 10,
          }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCompleteType="password"
          placeholder="password"
        />
        <SquareButton
          content="Login"
          filled
          handlePress={handleLogin}
          disabled={authLoading}
        />
        {authLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {newSessionError && (
          <Text style={Fonts.textRegular}>{newSessionError.message}</Text>
        )}
        {registerError && (
          <Text style={Fonts.textRegular}>{registerError.message}</Text>
        )}

        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: Colors.text }}>Dark mode</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#f4f3f4' }}
            thumbColor={isEnabled ? Colors.primary : '#f4f3f4'}
            onValueChange={() =>
              changeTheme({ theme: 'default', darkMode: !theme.darkMode })
            }
            value={isEnabled}
          />
        </View>
      </View>
    </Animated.View>
  )
}

export default IndexAuthContainer
