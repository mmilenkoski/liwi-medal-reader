/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View, TouchableOpacity, TextInput, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import filter from 'lodash/filter'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import SetAnswer from '@/Store/MedicalCase/SetAnswer'

const Autocomplete = ({ questionId }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    Colors,
    FontSize,
    Gutters,
    Layout,
    Components: { autocomplete },
  } = useTheme()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [optionSelected, setOptionSelected] = useState(false)

  const question = useSelector(
    state => state.medicalCase.item.nodes[questionId],
  )
  const villageList = useSelector(state => state.algorithm.item.village_json)

  /**
   * Handles the filtering and reset of the searchResults
   */
  useEffect(() => {
    if (searchTerm.length === 0 || optionSelected) {
      setSearchResults([])
    } else {
      const filteredVillageList = filter(villageList, village =>
        Object.values(village)[0].match(new RegExp(searchTerm, 'i')),
      )
      setSearchResults(filteredVillageList.slice(0, 5))
    }
  }, [searchTerm])

  /**
   * When the user selects an option, the search term is updated and the search results are cleared to close the dropdown
   * @param option
   */
  const handleOptionSelect = option => {
    setOptionSelected(true)
    setSearchTerm(option)
    dispatch(SetAnswer.action({ nodeId: question.id, value: option }))
  }

  /**
   * Save value in store
   */
  const onEndEditing = () => {
    if (question.value !== searchTerm) {
      dispatch(SetAnswer.action({ nodeId: question.id, value: searchTerm }))
    }
  }

  /**
   * Updates the search term
   * @param text
   */
  const handleChangeText = text => {
    setOptionSelected(false)
    setSearchTerm(text)
  }

  /**
   * Renders each result line for searchResults
   * @param result
   * @param index
   * @returns {JSX.Element}
   */
  const renderResult = (result, index) => {
    const resultString = Object.values(result)[0]

    return (
      <View
        key={`village-${resultString}`}
        style={autocomplete.dropdownItemWrapper(
          index === searchResults.length - 1,
        )}
      >
        <TouchableOpacity
          style={[Gutters.regularVPadding, Gutters.smallHPadding]}
          onPress={() => handleOptionSelect(resultString)}
        >
          <Text style={autocomplete.dropdownItemText}>{resultString}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[Gutters.smallTMargin, Layout.fullWidth]}>
      <View style={autocomplete.inputWrapper(searchResults.length > 0)}>
        <View style={autocomplete.inputTextWrapper}>
          <TextInput
            style={autocomplete.inputText}
            keyboardType="default"
            onChangeText={handleChangeText}
            onEndEditing={onEndEditing}
            value={searchTerm}
            placeholder={t('application.search')}
          />
        </View>
        <View style={autocomplete.searchIcon}>
          <Icon name="search" color={Colors.grey} size={FontSize.large} />
        </View>
      </View>
      {searchResults.length > 0 && (
        <View style={autocomplete.resultsDropdown}>
          {searchResults.map((result, i) => renderResult(result, i))}
        </View>
      )}
    </View>
  )
}

export default Autocomplete
