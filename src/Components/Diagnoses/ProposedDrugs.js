/**
 * The external imports
 */
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'
import { Icon, AdditionalSelect } from '@/Components'
import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'
import AddRefusedDrugs from '@/Store/MedicalCase/Drugs/AddRefusedDrugs'
import RemoveAgreedDrugs from '@/Store/MedicalCase/Drugs/RemoveAgreedDrugs'
import RemoveRefusedDrugs from '@/Store/MedicalCase/Drugs/RemoveRefusedDrugs'

const ProposedDrugs = ({ type }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Fonts,
    Colors,
    Gutters,
    FontSize,
    Containers: { medicalCaseFinalDiagnoses, medicalCaseDrugs },
    Components: { booleanButton },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)
  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis[type])

  console.log(diagnoses)

  /**
   * Updates the proposed diagnoses by sorting them into agreed or refused
   * @param diagnosisId
   * @param drugId
   * @param value
   */
  const updateDrugs = (diagnosisId, drugId, value) => {
    const tempAgreedDrugs = { ...diagnoses[diagnosisId].drugs.agreed }
    const tempRefusedDrugs = [...diagnoses[diagnosisId].drugs.refused]
    const isInAgreed = Object.keys(tempAgreedDrugs).includes(drugId.toString())
    const isInRefused = tempRefusedDrugs.includes(drugId)

    // From null to Agree
    if (value && !isInAgreed) {
      tempAgreedDrugs[diagnosisId] = {
        id: diagnosisId.toString(),
        drugs: {},
      }
      dispatch(
        AddAgreedDrugs.action({
          type,
          drugId,
          diagnosisId: diagnosisId,
          drugContent: { id: drugId },
        }),
      )

      // From Disagree to Agree
      if (isInRefused) {
        tempRefusedDrugs.splice(tempRefusedDrugs.indexOf(drugId), 1)
        dispatch(
          RemoveRefusedDrugs.action({
            type,
            diagnosisId: diagnosisId,
            newRefusedDrugs: tempRefusedDrugs,
          }),
        )
      }
    }

    // From null to Disagree
    if (!value && !isInRefused) {
      tempRefusedDrugs.push(drugId)
      dispatch(
        AddRefusedDrugs.action({
          type,
          diagnosisId: diagnosisId,
          newRefusedDrugs: tempRefusedDrugs,
        }),
      )

      // From Agree to Disagree
      if (isInAgreed) {
        dispatch(
          RemoveAgreedDrugs.action({
            type,
            drugId,
            diagnosisId: diagnosisId,
          }),
        )
      }
    }
  }

  /**
   * Renders the boolean buttons to agree/disagree with the proposed diagnoses
   * @param diagnosis
   * @param drugId
   * @returns {JSX.Element}
   */
  const renderBooleanButton = (diagnosis, drugId) => {
    const isAgree = Object.keys(diagnosis.drugs.agreed).includes(
      drugId.toString(),
    )
    const isDisagree = diagnosis.drugs.refused.includes(drugId)

    return (
      <View style={medicalCaseDrugs.booleanButtonWrapper}>
        <View
          key="booleanButton-left"
          style={booleanButton.buttonWrapper(
            'left',
            isAgree,
            false,
            true,
            Colors.lightGrey,
          )}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => updateDrugs(diagnosis.id, drugId, true)}
          >
            <Text style={booleanButton.buttonText(isAgree)}>
              {t('containers.medical_case.common.agree')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          key="booleanButton-right"
          style={booleanButton.buttonWrapper(
            'right',
            isDisagree,
            false,
            true,
            Colors.lightGrey,
          )}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => updateDrugs(diagnosis.id, drugId, false)}
          >
            <Text style={booleanButton.buttonText(isDisagree)}>
              {t('containers.medical_case.common.disagree')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return Object.values(diagnoses).map(diagnosis => (
    <View style={medicalCaseDrugs.wrapper}>
      <View style={medicalCaseDrugs.diagnosisHeaderWrapper}>
        <Text style={medicalCaseDrugs.diagnosisHeader}>
          {translate(algorithm.nodes[diagnosis.id].label)}
        </Text>
        <Text style={medicalCaseDrugs.diagnosisType}>
          {t(
            `containers.medical_case.drugs.${
              type === 'agreed' ? 'proposed' : 'additional'
            }`,
          )}
        </Text>
      </View>
      <View style={Gutters.regularHPadding}>
        <Text style={medicalCaseDrugs.drugsHeader}>
          {t('containers.medical_case.drugs.drugs')}
        </Text>
        {diagnosis.drugs.proposed.map((drugId, i) => (
          <View
            style={medicalCaseDrugs.drugWrapper(
              i === diagnosis.drugs.proposed.length - 1,
            )}
          >
            <View style={medicalCaseDrugs.drugTitleWrapper}>
              <Text style={medicalCaseDrugs.drugTitle}>
                {translate(algorithm.nodes[drugId].label)}
              </Text>
              {renderBooleanButton(diagnosis, drugId)}
            </View>
            <Text style={Fonts.textSmall}>
              {translate(algorithm.nodes[drugId].description)}
            </Text>
          </View>
        ))}
      </View>
      <View style={Gutters.regularHPadding}>
        <AdditionalSelect
          list={Object.values(diagnosis.drugs.additional)}
          listItemType="drugs"
          navigateTo="Drugs"
          handleRemove={() => console.log('remove')}
        />
      </View>
    </View>
  ))
}

export default ProposedDrugs
