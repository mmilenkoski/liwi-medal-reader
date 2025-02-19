/**
 * The external imports
 */
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { UpdateDrugService } from '@/Services/MedicalCase'

const DrugBooleanButton = ({ diagnosis, drugId, diagnosisKey }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { drugs },
    Components: { booleanButton },
  } = useTheme()

  const { t } = useTranslation()

  const isAgreed = Object.keys(diagnosis.drugs.agreed).includes(
    drugId.toString(),
  )
  const isRefused = diagnosis.drugs.refused.includes(drugId)

  return (
    <View style={drugs.booleanButtonWrapper}>
      <View style={booleanButton.buttonWrapper('left', isAgreed, false)}>
        <TouchableOpacity
          style={Layout.center}
          onPress={() =>
            UpdateDrugService(diagnosis.id, drugId, true, diagnosisKey)
          }
        >
          <Text style={booleanButton.buttonText(isAgreed)}>
            {t('containers.medical_case.common.agree')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={booleanButton.buttonWrapper('right', isRefused, false)}>
        <TouchableOpacity
          style={Layout.center}
          onPress={() =>
            UpdateDrugService(diagnosis.id, drugId, false, diagnosisKey)
          }
        >
          <Text style={booleanButton.buttonText(isRefused)}>
            {t('containers.medical_case.common.disagree')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DrugBooleanButton
