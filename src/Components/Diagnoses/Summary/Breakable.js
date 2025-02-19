/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { formulationLabel } from '@/Utils/Formulations/FormulationLabel'
import { roundSup } from '@/Utils/Formulations/RoundSup'
import { translate } from '@/Translations/algorithm'
import { Config } from '@/Config'
import { breakableFraction } from '@/Utils/Formulations/BreakableFraction'
import { useTheme } from '@/Theme'

const Breakable = ({ drug, drugDose, diagnosisId }) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { summary },
  } = useTheme()

  const { t } = useTranslation()

  const fractionString = breakableFraction(drugDose)

  const drugInstance = useSelector(
    state => state.algorithm.item.nodes[diagnosisId].drugs[drug.id],
  )

  return (
    <View>
      <Text style={summary.drugText}>{formulationLabel(drugDose)}</Text>
      {drugDose.by_age ? (
        <>
          <Text style={summary.drugText}>{`${roundSup(
            drugDose.unique_dose,
          )} ${t('formulations.drug.tablets')} ${t(
            'formulations.medication_form.per_administration',
          )} ${t('formulations.drug.every')} ${drugDose.recurrence} ${t(
            'formulations.drug.h',
          )} ${drug.duration || drugInstance.duration} ${t(
            'formulations.drug.days',
          )}`}</Text>
          <Text style={[Gutters.regularTMargin, summary.drugText]}>
            {translate(drugDose.dispensing_description)}
          </Text>
        </>
      ) : drugDose.doseResult === null ? (
        <Text style={summary.drugText}>{drugDose.no_possibility}</Text>
      ) : (
        <View>
          <Text style={summary.drugText}>
            {`${t('formulations.drug.give')} ${
              drugDose.doseResult * (drugDose.dose_form / drugDose.breakable)
            } ${t('formulations.drug.mg')} : ${fractionString} ${t(
              'formulations.drug.tablet',
            )} ${drugDose.dose_form}`}
            {t('formulations.drug.mg')} {drugDose.administration_route_name}
          </Text>
          <Text style={summary.drugText}>{`${t('formulations.drug.every')} ${
            drugDose.recurrence
          } ${t('formulations.drug.h')} ${
            drugInstance ? drugInstance.duration : drug.duration
          } ${t('formulations.drug.days')}`}</Text>
          <Text style={[Gutters.regularTMargin, summary.drugText]}>
            {translate(drugDose.dispensing_description)}
          </Text>
        </View>
      )}
      {Config.ADMINISTRATION_ROUTE_CATEGORIES.includes(
        drugDose.administration_route_category,
      ) && (
        <Text
          style={[Gutters.regularTMargin, summary.drugText]}
          key={`text_${drug.id}`}
        >
          {translate(drugDose.injection_instructions)}
        </Text>
      )}
    </View>
  )
}

export default Breakable
