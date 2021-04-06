import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import {BooleanButtons, SectionHeader, Select, SquareButton, RoundedButton, Checkbox} from '@/Components'
import { useTheme } from '@/Theme'
import FetchOne from '@/Store/User/FetchOne'
import { useTranslation } from 'react-i18next'
import ChangeTheme from '@/Store/Theme/ChangeTheme'

const IndexExampleContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const user = useSelector(state => state.user.item)
  const fetchOneUserLoading = useSelector(state => state.user.fetchOne.loading)
  const fetchOneUserError = useSelector(state => state.user.fetchOne.error)

  const [userId, setUserId] = useState('1')

  const fetch = id => {
    setUserId(id)
    dispatch(FetchOne.action(id))
  }

  const changeTheme = ({ theme, darkMode }) => {
    dispatch(ChangeTheme.action({ theme, darkMode }))
  }

  return (
    <View style={[Layout.fill, Layout.colCenter, Gutters.largeHPadding]}>
      <SectionHeader label="Questions" />
      <View style={[Gutters.largeTMargin, Layout.row, Layout.justifyContentBetween, Layout.fullWidth, Layout.alignItemsCenter]}>
        <Text style={[Fonts.textRegular]}>Am I the man ?</Text>
        <BooleanButtons width={200} answers={['Yes', 'No']} />
      </View>

      <View style={[Gutters.largeVMargin, Layout.row, Layout.justifyContentBetween, Layout.fullWidth, Layout.alignItemsCenter]}>
        <Text style={[Fonts.textRegular]}>Select how awesome I am</Text>
        <Select />
      </View>

      {/* Square buttons */}
      <SquareButton content="Hello there" filled />
      <View style={{ paddingTop: 10 }}>
        <SquareButton content="Hello there" filled disabled />
      </View>
      <View style={{ paddingTop: 10 }}>
        <SquareButton content="General Kenobi" />
      </View>
      <View style={{ paddingTop: 10 }}>
        <SquareButton content="General Kenobi" disabled />
      </View>

      {/* Rounded buttons */}
      <View style={{ paddingTop: 20 }}>
        <RoundedButton content="Add" icon="add" />
      </View>
      <View style={{ paddingTop: 10 }}>
        <RoundedButton content="Add" icon="add" disabled />
      </View>

      {/* Checkboxes */}
      <View style={{ paddingTop: 20 }}>
        <Checkbox content="Unavailable" />
      </View>
      <View style={{ paddingTop: 10 }}>
        <Checkbox content="Unavailable" disabled />
      </View>
    </View>
  )
}

export default IndexExampleContainer
