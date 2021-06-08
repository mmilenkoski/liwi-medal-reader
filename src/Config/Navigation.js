/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import BasicMeasurementMedicalCaseContainer from '@/Containers/MedicalCase/FirstAssessment/BasicMeasurement'
import ComplaintCategoryMedicalCaseContainer from '@/Containers/MedicalCase/FirstAssessment/ComplaintCategory'
import UniqueTriageQuestionsMedicalCaseContainer from '@/Containers/MedicalCase/FirstAssessment/UniqueTriageQuestions'
import RegistrationMedicalCaseContainer from '@/Containers/MedicalCase/Registration'
import MedicalCaseDiagnosesIndexContainer from '@/Containers/MedicalCase/Diagnoses/DiagnosesIndex'
//
// We splitted the stages because some algorithms don't have referral so we are building the Stages with different pieces
//

// REMOVE THIS SHIT WHEN VIEWS ARE DONE
function ToDo() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ToDo!</Text>
    </View>
  )
}

const diagnosesStage = {
  label: 'diagnoses',
  icon: 'diagnosis',
  component: 'DiagnosesWrapper',
  steps: [
    {
      label: 'final_diagnoses',
      component: MedicalCaseDiagnosesIndexContainer,
    },
    {
      label: 'healthcare_questions',
      component: ToDo,
    },
    {
      label: 'medicines',
      component: ToDo,
    },
    {
      label: 'formulations',
      component: ToDo,
    },
    {
      label: 'summary',
      component: ToDo,
    },
  ],
}

const referralStep = {
  label: 'referral',
  component: 'Referral',
}

const baseInterventionStages = [
  {
    label: 'registration',
    icon: 'registration',
    component: 'RegistrationWrapper',
    steps: [
      {
        label: 'registration',
        component: RegistrationMedicalCaseContainer,
      },
    ],
  },
  {
    label: 'first_assessments',
    icon: 'assessment',
    component: 'FirstAssessmentsWrapper',
    steps: [
      {
        label: 'unique_triage_questions',
        component: UniqueTriageQuestionsMedicalCaseContainer,
      },
      {
        label: 'complaint_categories',
        component: ComplaintCategoryMedicalCaseContainer,
      },
      {
        label: 'basic_measurements',
        component: BasicMeasurementMedicalCaseContainer,
      },
    ],
  },
  {
    label: 'consultation',
    icon: 'consultation',
    component: 'ConsultationWrapper',
    steps: [
      {
        label: 'medical_history',
        component: ToDo,
      },
      {
        label: 'physical_exams',
        component: ToDo,
      },
      {
        label: 'comment',
        component: ToDo,
      },
    ],
  },
  {
    label: 'assessments',
    icon: 'tests',
    component: 'AssessmentsWrapper',
    steps: [
      {
        label: 'assessments',
        component: ToDo,
      },
    ],
  },
]

const INTERVENTION_STAGES = [...baseInterventionStages, diagnosesStage]

const REFERRAL_INTERVENTION_STAGES = [
  ...baseInterventionStages,
  { ...diagnosesStage, steps: [...diagnosesStage.steps, referralStep] },
]

const ARM_CONTROL_STAGES = INTERVENTION_STAGES

export default {
  INTERVENTION_STAGES,
  REFERRAL_INTERVENTION_STAGES,
  ARM_CONTROL_STAGES,
}
