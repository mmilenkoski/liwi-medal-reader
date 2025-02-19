/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Drug } from '@/Components'

const Drugs = ({ diagnosis }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { finalDiagnoses, summary },
  } = useTheme()

  const { t } = useTranslation()

  const [keys] = useState(['agreed', 'additional'])

  return (
    <View>
      <View style={[Layout.rowHCenter, Layout.justifyContentBetween]}>
        <Text style={summary.drugsHeader}>
          {t('containers.medical_case.drugs.drugs')}
        </Text>
      </View>
      {Object.keys(diagnosis.drugs.agreed).length +
        Object.keys(diagnosis.drugs.additional).length ===
      0 ? (
        <Text style={finalDiagnoses.noItemsText}>
          {t('containers.medical_case.drugs.no_medicines')}
        </Text>
      ) : (
        keys.map(key =>
          Object.values(diagnosis.drugs[key]).map((drug, i) => (
            <Drug
              key={`summary_diagnosis_drugs-${drug.id}`}
              drug={drug}
              diagnosisId={diagnosis.id}
              isLast={i === Object.keys(diagnosis.drugs[key]).length - 1}
            />
          )),
        )
      )}
    </View>
  )
}

export default Drugs
