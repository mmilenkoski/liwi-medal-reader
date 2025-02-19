/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DocumentDirectoryPath, readFile, exists } from 'react-native-fs'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import { Clinician, CustomClinician, ToggleSwitchDarkMode } from '@/Components'
import { navigateAndSimpleReset } from '@/Navigators/Root'
import ChangeEmergencyContent from '@/Store/Emergency/ChangeEmergencyContent'
import ChangeClinician from '@/Store/HealthFacility/ChangeClinician'

const ClinicianSelectionAuthContainer = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { auth, global, authClinicianSelection },
  } = useTheme()

  const { t } = useTranslation()
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
    const fileExist = await exists(targetPath)

    if (fileExist) {
      const emergencyContent = await readFile(targetPath)
      dispatch(
        ChangeEmergencyContent.action({
          newContent: emergencyContent,
        }),
      )
    }
  }

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  // Load to store new emergency content
  useEffect(() => {
    if (algorithmUpdated) {
      newEmergencyContent()
    }
  }, [algorithmUpdated])

  /**
   * Set clinician and redirect user to Pin container
   * @param currentClinician
   * @returns {Promise<void>}
   */
  const handleClinician = async currentClinician => {
    await dispatch(ChangeClinician.action({ clinician: currentClinician }))
    navigateAndSimpleReset('Pin')
  }

  return (
    <ScrollView contentContainerStyle={Layout.grow}>
      <Animated.View
        style={[Layout.fill, global.animation(fadeAnim), global.wrapper]}
      >
        <Text style={auth.header}>{healthFacility.name}</Text>
        <View style={authClinicianSelection.wrapper}>
          {healthFacility.medical_staffs.map(clinician => (
            <Clinician
              key={clinician.id}
              currentClinician={clinician}
              handleClinician={handleClinician}
            />
          ))}
          <CustomClinician handleClinician={handleClinician} />
        </View>

        <View style={auth.themeToggleWrapper}>
          <ToggleSwitchDarkMode label={t('application.theme.dark_mode')} />
        </View>
      </Animated.View>
    </ScrollView>
  )
}

export default ClinicianSelectionAuthContainer
