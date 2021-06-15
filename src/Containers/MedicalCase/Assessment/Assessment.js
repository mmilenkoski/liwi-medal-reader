/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import isEqual from 'lodash/isEqual'

/**
 * The internal imports
 */
import { Question, EmptyList } from '@/Components'

const AssessmentMedicalCaseContainer = props => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()
  const [questions, setQuestions] = useState(TODO)

  // Update questions list only if question array change
  useEffect(() => {
    const basicMeasurementQuestions = TODO
    if (!isEqual(basicMeasurementQuestions, questions)) {
      setQuestions(basicMeasurementQuestions)
    }
  }, [isFocused])

  return (
    <View>
      <FlatList
        data={questions}
        renderItem={({ item }) => <Question questionId={item} />}
        ListEmptyComponent={
          <EmptyList text={t('containers.medical_case.no_questions')} />
        }
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default AssessmentMedicalCaseContainer
