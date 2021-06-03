/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DocumentDirectoryPath, readFile } from 'react-native-fs'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import { Clinician, ToggleSwitchDarkMode } from '@/Components'
import { navigate } from '@/Navigators/Root'
import ChangeEmergencyContent from '@/Store/Emergency/ChangeEmergencyContent'

const ClinicianSelectionAuthContainer = props => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Layout,
    Containers: { auth, global, authClinicianSelection },
  } = useTheme()
  const dispatch = useDispatch()

  // Local state definition
  const fadeAnim = useRef(new Animated.Value(0)).current
  const healthFacility = useSelector(state => state.healthFacility.item)
  const algorithmUpdated = useSelector(state => state.algorithm.item.updated)

  /**
   * Store new emergency content
   */
  const newEmergencyContent = async () => {
    const targetPath = `${DocumentDirectoryPath}/emergency_content.html`
    const emergencyContent = await readFile(targetPath)
    dispatch(
      ChangeEmergencyContent.action({
        newContent: emergencyContent,
      }),
    )
  }

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  useEffect(() => {
    if (algorithmUpdated) {
      newEmergencyContent()
    }
  }, [algorithmUpdated])

  return (
    <ScrollView contentContainerStyle={Layout.grow}>
      <Animated.View
        style={[Layout.fill, global.animation(fadeAnim), global.wrapper]}
      >
        <Text style={auth.header}>{healthFacility.name}</Text>
        <View style={authClinicianSelection.wrapper}>
          {healthFacility.medical_staffs.map(clinician => (
            <Clinician key={clinician.id} currentClinician={clinician} />
          ))}
        </View>

        <View style={auth.themeToggleWrapper}>
          <ToggleSwitchDarkMode label={t('application.theme.dark_mode')} />
        </View>
      </Animated.View>
    </ScrollView>
  )
}

export default ClinicianSelectionAuthContainer
