/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { AdditionalSelect, DrugBooleanButton } from '@/Components'
import ChangeAdditionalDrugDuration from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugDuration'
import RemoveAdditionalDrugs from '@/Store/MedicalCase/Drugs/RemoveAdditionalDrugs'
import SetDrugs from '@/Store/MedicalCase/Drugs/SetDrugs'

const DiagnosisDrugs = ({ diagnosisKey }) => {
  // Theme and style elements deconstruction
  const {
    Fonts,
    Gutters,
    Containers: { finalDiagnoses, drugs },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const algorithm = useSelector(state => state.algorithm.item)
  const diagnoses = useSelector(
    state => state.medicalCase.item.diagnosis[diagnosisKey],
  )

  useEffect(() => {
    dispatch(SetDrugs.action())
  }, [isFocused])
  /**
   * Removes a single element from the additional diagnosis list
   * @param diagnosisId
   * @param drugId
   */
  const removeAdditionalDrug = (diagnosisId, drugId) => {
    dispatch(
      RemoveAdditionalDrugs.action({
        diagnosisKey,
        diagnosisId,
        drugId,
      }),
    )
  }

  /**
   * Updates the selected additional drug duration
   * @param diagnosisId
   * @param drugId
   * @param duration
   */
  const updateAdditionalDrugDuration = (diagnosisId, drugId, duration) => {
    dispatch(
      ChangeAdditionalDrugDuration.action({
        diagnosisKey,
        diagnosisId,
        drugId,
        duration,
      }),
    )
  }

  return Object.values(diagnoses).map(diagnosis => (
    <View key={`diagnosis-${diagnosis.id}`} style={drugs.wrapper}>
      <View style={drugs.diagnosisHeaderWrapper}>
        <Text style={drugs.diagnosisHeader}>
          {translate(algorithm.nodes[diagnosis.id].label)}
        </Text>
        <Text style={drugs.diagnosisKey}>
          {t(
            `containers.medical_case.drugs.${
              diagnosisKey === 'agreed' ? 'proposed' : 'additional'
            }`,
          )}
        </Text>
      </View>
      <View style={Gutters.regularHPadding}>
        <Text style={drugs.drugsHeader}>
          {t('containers.medical_case.drugs.drugs')}
        </Text>
        {diagnosis.drugs.proposed.length === 0 ? (
          <Text style={finalDiagnoses.noItemsText}>
            {t('containers.medical_case.drugs.no_proposed')}
          </Text>
        ) : (
          diagnosis.drugs.proposed.map((drugId, i) => (
            <View
              key={`diagnosis_drugs-${drugId}`}
              style={drugs.drugWrapper(
                i === diagnosis.drugs.proposed.length - 1,
              )}
            >
              <View style={drugs.drugTitleWrapper}>
                <Text style={drugs.drugTitle}>
                  {translate(algorithm.nodes[drugId].label)}
                </Text>
                <DrugBooleanButton
                  diagnosis={diagnosis}
                  drugId={drugId}
                  diagnosisKey={diagnosisKey}
                />
              </View>
              <Text style={drugs.drugDescription}>
                {translate(algorithm.nodes[drugId].description)}
              </Text>
            </View>
          ))
        )}
      </View>
      <View style={Gutters.regularHPadding}>
        <AdditionalSelect
          listObject={diagnosis.drugs.additional}
          listItemType="drugs"
          handleRemove={removeAdditionalDrug}
          diagnosisId={diagnosis.id}
          diagnosisKey={diagnosisKey}
          withDuration
          onUpdateDuration={updateAdditionalDrugDuration}
        />
      </View>
    </View>
  ))
}

export default DiagnosisDrugs
