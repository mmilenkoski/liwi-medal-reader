/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const SearchBar = props => {
  // Props deconstruction
  const { navigation, filters = false } = props

  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Layout,
    Colors,
    Components: { searchBar },
  } = useTheme()

  return (
    <View style={[Layout.fill]}>
      <TouchableWithoutFeedback onPress={() => navigation.push('Search')}>
        <View style={[Layout.row]}>
          <View style={[searchBar.inputWrapper]}>
            <View style={[Layout.colCenter]}>
              <Icon name={'search'} color={Colors.grey} />
            </View>
            <View style={[searchBar.inputTextWrapper]}>
              <Text style={[searchBar.inputText]}>{t('actions.search')}</Text>
            </View>
          </View>
          {filters && (
            <TouchableOpacity
              style={[searchBar.filterButton]}
              onPress={() => navigation.push('Filter')}
            >
              <Icon name={'filtre'} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default SearchBar
