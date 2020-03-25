import { store } from '../store';
import { categories } from '../constants';
import { updateMetaData } from '../actions/creators.actions';
import { calculateCondition } from './conditionsHelpers.algo';

/**
 * This file contains methods to filter questions to each stages / steps
 */

/**
 * Get Medical History for consultation
 * Update metadata
 */
export const questionsMedicalHistory = () => {
  const state$ = store.getState();
  const questions = state$.nodes.filterBy(
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.symptom,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.exposure,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.basicMeasurement,
      },
    ],
    'OR',
    'array',
    false
  );
  if (state$.metaData.consultation.medicalHistory.length === 0 && questions.length !== 0) {
    store.dispatch(
      updateMetaData(
        'consultation',
        'medicalHistory',
        questions.map(({ id }) => id)
      )
    );
  }
  return questions;
};

/**
 * Get physical Exam for consultation
 * Update metadata
 */
export const questionsPhysicalExam = () => {
  const state$ = store.getState();
  const questions = state$.nodes.filterBy(
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.physicalExam,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.other,
      },
    ],
    'OR',
    'array',
    false
  );

  if (state$.metaData.consultation.physicalExam.length === 0 && questions.length !== 0) {
    store.dispatch(
      updateMetaData(
        'consultation',
        'physicalExam',
        questions.map(({ id }) => id)
      )
    );
  }

  return questions;
};

/**
 * Get FirstLook Assessement for triage
 * Update metadata
 */
export const questionsFirstLookAssessement = () => {
  const state$ = store.getState();
  const firstLookAssessement = [];

  const ordersFirstLookAssessment = state$.triage.orders[categories.emergencySign];

  if (ordersFirstLookAssessment !== undefined) {
    ordersFirstLookAssessment.map((order) => {
      firstLookAssessement.push(state$.nodes[order]);
    });
  }

  if (state$.metaData.triage.firstLookAssessments.length === 0 && firstLookAssessement.length !== 0) {
    store.dispatch(
      updateMetaData(
        'triage',
        'firstLookAssessments',
        firstLookAssessement.map(({ id }) => id)
      )
    );
  }

  return firstLookAssessement;
};

/**
 * Get ComplaintCategory for triage
 * Update metadata
 */
export const questionsComplaintCategory = () => {
  const state$ = store.getState();
  const complaintCategory = [];
  const orders = state$.triage.orders[categories.complaintCategory];

  orders.map((order) => {
    complaintCategory.push(state$.nodes[order]);
  });

  if (state$.metaData.triage.complaintCategories.length === 0 && complaintCategory.length !== 0) {
    store.dispatch(
      updateMetaData(
        'triage',
        'complaintCategories',
        complaintCategory.map(({ id }) => id)
      )
    );
  }

  return complaintCategory;
};

/**
 * Get Basic Measurements for triage
 * Update metadata
 */
export const questionsBasicMeasurements = () => {
  const state$ = store.getState();
  const basicMeasurements = [];

  const orderedQuestions = state$.triage.orders[categories.basicMeasurement];

  if (orderedQuestions !== undefined) {
    orderedQuestions.map((orderedQuestion) => {
      const question = state$.nodes[orderedQuestion];
      if (question.isDisplayedInTriage(state$)) {
        basicMeasurements.push(question);
      }
    });
  }

  // Set Questions in State for validation
  if (state$.metaData.triage.basicMeasurements.length === 0 && basicMeasurements.length !== 0) {
    store.dispatch(
      updateMetaData(
        'triage',
        'basicMeasurements',
        basicMeasurements.map(({ id }) => id)
      )
    );
  }

  return basicMeasurements;
};

/**
 * Get questions for Test
 * Update metadata
 */
export const questionsTests = () => {
  const state$ = store.getState();
  let assessmentTest = [];
  assessmentTest = state$.nodes.filterBy([{ by: 'category', operator: 'equal', value: categories.assessment }]);

  if (state$.metaData.tests.tests.length === 0 && assessmentTest.length !== 0) {
    store.dispatch(
      updateMetaData(
        'tests',
        'tests',
        assessmentTest.map(({ id }) => id)
      )
    );
  }

  return assessmentTest;
};

export const titleMannualyDiagnoses = () => {
  const state$ = store.getState();
  const {
    diagnoses: { additional },
  } = state$;

  if (Object.keys(additional).length === 0) {
    return false;
  }
  let firstToTrue = false;
  Object.keys(additional).map((q) => {
    Object.keys(additional[q].drugs).map((f) => {
      if (additional[q].drugs[f].agreed === true) {
        firstToTrue = true;
      }
    });
  });

  return firstToTrue;
};

export const titleManagementCounseling = () => {
  const state$ = store.getState();
  const { diagnoses } = state$;

  if (Object.keys(diagnoses.additional).length === 0 && Object.keys(diagnoses.proposed).length === 0) {
    return false;
  }

  let isPossible = false;
  Object.keys(diagnoses.additional).map((id) => {
    Object.keys(diagnoses.additional[id].managements).map((m) => {
      if (calculateCondition(diagnoses.additional[id].managements[m]) === true) {
        isPossible = true;
      }
    });
  });

  Object.keys(diagnoses.proposed).map((id) => {
    Object.keys(diagnoses.proposed[id].managements).map((m) => {
      if (calculateCondition(diagnoses.proposed[id].managements[m]) === true) {
        isPossible = true;
      }
    });
  });

  return isPossible;
};

export const getDrugs = () => {
  const state$ = store.getState();
  const {
    diagnoses,
    diagnoses: { additionalDrugs },
  } = state$;
  let drugs = {};

  const doubleString = ['proposed', 'additional'];

  doubleString.map((iteration) => {
    Object.keys(diagnoses[iteration]).map((diagnoseId) => {
      if (diagnoses[iteration][diagnoseId].agreed === true || iteration === 'additional') {
        Object.keys(diagnoses[iteration][diagnoseId].drugs).map((drugId) => {
          if (diagnoses[iteration][diagnoseId].drugs[drugId].agreed === true && calculateCondition(diagnoses[iteration][diagnoseId].drugs[drugId]) === true) {
            if (drugs[drugId] === undefined) {
              // new one
              drugs[drugId] = diagnoses[iteration][diagnoseId]?.drugs[drugId];
              drugs[drugId].diagnoses = [{ id: diagnoseId, type: iteration }];
            } else {
              // doublon
              drugs[drugId].diagnoses.push({ id: diagnoseId, type: iteration });
              if (diagnoses[iteration][diagnoseId]?.drugs[drugId].duration > drugs[drugId].duration) {
                drugs[drugId].duration = diagnoses[iteration][diagnoseId]?.drugs[drugId].duration;
              }
            }
          }
        });
      }
    });
  });

  Object.keys(additionalDrugs).map((ky) => {
    if (drugs[ky] === undefined) {
      // new one
      drugs[ky] = additionalDrugs[ky];
      drugs[ky].diagnoses = [null];
    } else {
      // doublon
      drugs[ky].diagnoses.push(null);
    }
  });

  return drugs;
};
