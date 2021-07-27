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
import { useTheme } from '@/Theme'

const Liquid = ({ drug, drugDose, diagnosisId }) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { summary },
  } = useTheme()

  const { t } = useTranslation()

  const ratio = drugDose.liquid_concentration / drugDose.dose_form

  const drugInstance = useSelector(
    state => state.algorithm.item.nodes[diagnosisId].drugs[drug.id],
  )

  const duration = drugInstance ? drugInstance.duration : drug.duration

  return (
    <View>
      <Text style={summary.drugText}>{formulationLabel(drugDose)}</Text>
      {drugDose.by_age ? (
        <Text style={summary.drugText}>{`${roundSup(
          drugDose.unique_dose,
        )}ml ${t('formulations.medication_form.per_administration')} ${t(
          'formulations.drug.during',
        )} ${duration} ${t('formulations.drug.days')}`}</Text>
      ) : drugDose.doseResult === null ? (
        <Text style={summary.drugText}>{drugDose.no_possibility}</Text>
      ) : (
        <View>
          <Text style={summary.drugText}>
            {t('formulations.drug.give')} {ratio * drugDose.doseResult}
            {t('formulations.drug.mg')}: {drugDose.doseResult}
            {t('formulations.drug.ml')} {t('formulations.drug.of')}{' '}
            {drugDose.liquid_concentration}
            {t('formulations.drug.mg')}/{drugDose.dose_form}
            {t('formulations.drug.ml')}
          </Text>
          <Text style={summary.drugText}>{`${t('formulations.drug.every')} ${
            drugDose.recurrence
          } ${t('formulations.drug.h')} ${duration} ${t(
            'formulations.drug.days',
          )}`}</Text>
          {Config.ADMINISTRATION_ROUTE_CATEGORIES.includes(
            drugDose.administration_route_category,
          ) && (
            <Text style={summary.drugText} key={`text_${drug.id}`}>
              {translate(drugDose.injection_instructions)}
            </Text>
          )}
          <Text style={[Gutters.regularTMargin, summary.drugText]}>
            {translate(drugDose.dispensing_description)}
          </Text>
        </View>
      )}
    </View>
  )
}

export default Liquid
