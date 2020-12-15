import * as _ from 'lodash';

import moment from 'moment';
import { store } from '../store';
import { categories, stages } from '../constants';
import { updateMetaData, setAnswer } from '../actions/creators.actions';
import { nodeFilterBy } from '../helpers/Node.model';
import { questionBooleanValue, questionIsDisplayedInTriage } from '../helpers/Question.model';

/**
 * Removes questions if they are no longer needed
 * @param medicalCase
 * @param questionPerSystem
 * @param newQuestions
 * @param view
 * @returns {*}
 */
const removeQuestions = (medicalCase, questionPerSystem, newQuestions, view) => {
  const questionsToRemove = _.difference(medicalCase.metaData.consultation[view], newQuestions);
  if (questionsToRemove.length > 0) {
    return questionPerSystem.map((system) => {
      return { title: system.title, data: _.reject(system.data, (dataItem) => questionsToRemove.includes(dataItem.id)) };
    });
  }
  return questionPerSystem;
};

/**
 * Orders the questions in to the correct systems
 * @param medicalCase
 * @param answeredQuestionId
 * @param questions
 * @param questionPerSystem
 * @param systemOrders
 * @param algorithm
 * @param view
 * @returns {*}
 */
const orderQuestionsInSystems = (medicalCase, answeredQuestionId, questions, questionPerSystem, systemOrders, algorithm, view) => {
  if (medicalCase.metaData.consultation[view].length === 0) {
    questions.forEach((question) => {
      const index = questionPerSystem.findIndex((system) => system.title === String(question.system));
      // TODO: MUST BE REMOVED WHEN ALL SYSTEM IS SET FOR QUESTIONS
      if (index !== -1) {
        questionPerSystem[index].data.push(question);
      }
    });
  } else {
    questions.forEach((question) => {
      // Add question in 'follow_up_questions' system if his question's system was already answered
      if (
        (medicalCase.metaData.consultation[view].length > 0 && medicalCase.metaData.consultation[view].includes(question.id)) ||
        (algorithm.nodes[answeredQuestionId]?.system !== undefined &&
          !medicalCase.metaData.consultation[view].includes(question.id) &&
          systemOrders.indexOf(question.system) >= systemOrders.indexOf(algorithm.nodes[answeredQuestionId].system))
      ) {
        const systemIndex = questionPerSystem.findIndex((system) => system.title === String(question.system));

        // TODO: MUST BE REMOVED WHEN ALL SYSTEM IS SET FOR QUESTIONS
        if (systemIndex !== -1) {
          const questionIndex = questionPerSystem[systemIndex].data.findIndex((q) => q.id === question.id);
          if (questionIndex !== -1) {
            questionPerSystem[systemIndex].data[questionIndex] = question;
          } else {
            questionPerSystem[systemIndex].data.push(question);
          }
        }
      } else {
        const systemIndex = questionPerSystem.findIndex((system) => system.title === 'follow_up_questions');
        const questionIndex = questionPerSystem[systemIndex].data.findIndex((q) => q.id === question.id);
        if (questionIndex !== -1) {
          questionPerSystem[systemIndex].data[questionIndex] = question;
        } else {
          questionPerSystem[systemIndex].data.push(question);
        }
      }
    });
  }
  return questionPerSystem;
};

/**
 * Dispatched new questions to store and returns sorted questions
 * @param questionPerSystem
 * @param medicalCase
 * @param newQuestions
 * @param view
 * @param reducedView
 * @returns {*}
 */
const dispatchToStore = (questionPerSystem, medicalCase, newQuestions, view, reducedView) => {
  if (!_.isEqual(medicalCase.metaData.consultation[view], questionPerSystem)) {
    store.dispatch(updateMetaData('consultation', view, questionPerSystem));

    // Used to validate step
    store.dispatch(updateMetaData('consultation', reducedView, newQuestions));

    const filteredQuestions = questionPerSystem.filter((system) => system.data.length > 0);
    return sortQuestions(filteredQuestions);
  }

  const filteredQuestions = medicalCase.metaData.consultation[view].filter((system) => system.data.length > 0);
  return sortQuestions(filteredQuestions);
};

/**
 * Get Referrals for Diagnosis
 * Update metadata
 */
export const questionsReferrals = (algorithm) => {
  const medicalCase = store.getState();
  const referralQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.referral,
      },
    ],
    'OR',
    'array',
    false
  );
  return referralQuestions;
};

/**
 * Get Medical History for consultation
 * Update metadata
 */
export const questionsMedicalHistory = (algorithm, answeredQuestionId) => {
  const medicalCase = store.getState();
  const medicalHistoryQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
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
        value: categories.chronicCondition,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.observedPhysicalSign,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.vaccine,
      },
    ],
    'OR',
    'array',
    true
  );

  const systemOrders = algorithm.mobile_config.systems_order;

  let questionPerSystem = [];
  systemOrders.forEach((system) => {
    questionPerSystem.push({
      title: system,
      data:
        medicalCase.metaData.consultation.medicalHistoryQuestions?.find((medicalHistoryQuestion) => {
          return medicalHistoryQuestion.title === system;
        })?.data || [],
    });
  });

  const newQuestions = medicalHistoryQuestions.map(({ id }) => id);
  questionPerSystem = orderQuestionsInSystems(medicalCase, answeredQuestionId, medicalHistoryQuestions, questionPerSystem, systemOrders, algorithm, 'medicalHistory');
  questionPerSystem = removeQuestions(medicalCase, questionPerSystem, newQuestions, 'medicalHistory');
  return dispatchToStore(questionPerSystem, medicalCase, newQuestions, 'medicalHistoryQuestions', 'medicalHistory');
};

/**
 * Get physical Exam for consultation
 * Update metadata
 */
export const questionsPhysicalExam = (algorithm, answeredQuestionId) => {
  const medicalCase = store.getState();
  const vitalSignQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.vitalSignAnthropometric,
      },
    ],
    'OR',
    'array',
    false
  );

  const physicalExamQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.physicalExam,
      },
    ],
    'OR',
    'array',
    true
  );

  const questions = vitalSignQuestions.concat(physicalExamQuestions);
  const systemOrders = algorithm.mobile_config.systems_order;

  let questionPerSystem = [];
  systemOrders.forEach((system) => {
    questionPerSystem.push({
      title: system,
      data:
        medicalCase.metaData.consultation.physicalExamQuestions?.find((physicalExamQuestion) => {
          return physicalExamQuestion.title === system;
        })?.data || [],
    });
  });

  const newQuestions = questions.map(({ id }) => id);
  questionPerSystem = orderQuestionsInSystems(medicalCase, answeredQuestionId, questions, questionPerSystem, systemOrders, algorithm, 'physicalExam');
  questionPerSystem = removeQuestions(medicalCase, questionPerSystem, newQuestions, 'physicalExam');
  return dispatchToStore(questionPerSystem, medicalCase, newQuestions, 'physicalExamQuestions', 'physicalExam');
};

/**
 * Sorts the array of question
 * @param questionsPerSystem - Array to sort
 * @returns {*} - Sorted array
 */
const sortQuestions = (questionsPerSystem) => {
  return questionsPerSystem.map((system) => {
    system.data.sort((a, b) => {
      if (a.is_danger_sign === b.is_danger_sign || a?.emergency_status === b?.emergency_status) return 0;
      if (a.is_danger_sign === true || a?.emergency_status === 'referral') return -1;
      return 1;
    });
    return system;
  });
};

/**
 * Get FirstLook Assessment for triage
 * Update metadata
 */
export const questionsUniqueTriageQuestion = (algorithm) => {
  const medicalCase = store.getState();
  const uniqueTriageQuestions = [];

  const ordersUniqueTriageQuestion = algorithm.mobile_config.questions_orders[categories.uniqueTriageQuestion];

  if (ordersUniqueTriageQuestion !== undefined) {
    ordersUniqueTriageQuestion.forEach((order) => {
      uniqueTriageQuestions.push(medicalCase.nodes[order]);
    });
  }

  const newQuestions = uniqueTriageQuestions.map(({ id }) => id);

  // Update state$ first look assessment questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.triage.uniqueTriageQuestion, newQuestions)) {
    store.dispatch(updateMetaData('triage', 'uniqueTriageQuestion', newQuestions));
  }

  return uniqueTriageQuestions;
};

/**
 * Get ComplaintCategories for triage
 * Update metadata
 */
export const questionsComplaintCategory = (algorithm) => {
  const medicalCase = store.getState();
  const complaintCategories = [];
  const orders = algorithm.mobile_config.questions_orders[categories.complaintCategory];
  const { general_cc_id, yi_cc_general } = algorithm.config.basic_questions;

  const birthDate = medicalCase.nodes[algorithm.config.basic_questions.birth_date_question_id].value;
  const days = birthDate !== null ? moment().diff(birthDate, 'days') : 0;
  if(days <= 60) {
    store.dispatch(setAnswer(algorithm, yi_cc_general, Object.keys(algorithm.nodes[yi_cc_general].answers)[0]));
    store.dispatch(setAnswer(algorithm, general_cc_id, Object.keys(algorithm.nodes[general_cc_id].answers)[1]));
  } else {
    store.dispatch(setAnswer(algorithm, general_cc_id, Object.keys(algorithm.nodes[general_cc_id].answers)[0]));
    store.dispatch(setAnswer(algorithm, yi_cc_general, Object.keys(algorithm.nodes[yi_cc_general].answers)[1]));
  }
  orders.forEach((order) => {
    if (medicalCase.nodes[order].id !== algorithm.config.basic_questions.general_cc_id && medicalCase.nodes[order].id !== algorithm.config.basic_questions.yi_cc_general) {
      // Differentiate complaint categories specific for neo_nat (<= 60 days) cases and others
      // For all questions that do not appear, set the answer to "No"
      if ((days <= 60 && algorithm.nodes[order].is_neonat) || (days > 60 && !algorithm.nodes[order].is_neonat)) {
        complaintCategories.push(medicalCase.nodes[order]);
      } else {
        store.dispatch(setAnswer(algorithm, order, Object.keys(algorithm.nodes[order].answers)[1]));
      }
    }
  });
  const newQuestions = complaintCategories.map(({ id }) => id);

  // Update state$ complaint categories questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.triage.complaintCategories, newQuestions)) {
    store.dispatch(updateMetaData('triage', 'complaintCategories', newQuestions));
  }

  return complaintCategories;
};

/**
 * Get Basic Measurements for triage
 * Update metadata
 */
export const questionsBasicMeasurements = (algorithm) => {
  const medicalCase = store.getState();
  const basicMeasurements = [];
  const orderedQuestions = algorithm.mobile_config.questions_orders[categories.basicMeasurement];

  if (orderedQuestions !== undefined) {
    orderedQuestions.forEach((orderedQuestion) => {
      const mcNode = medicalCase.nodes[orderedQuestion];
      const currentNode = algorithm.nodes[orderedQuestion];

      // Main target -> exclude YI questions
      const isExcludedByComplaintCategory = currentNode.conditioned_by_cc.some((complaintCategory) => {
        return questionBooleanValue(algorithm, medicalCase.nodes[complaintCategory]) === false;
      });

      if (questionIsDisplayedInTriage(medicalCase, mcNode) && !isExcludedByComplaintCategory) {
        basicMeasurements.push(mcNode);
      }
    });
  }

  const newQuestions = basicMeasurements.map(({ id }) => id);

  // Update state$ basic measurements questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.triage.basicMeasurements, newQuestions)) {
    store.dispatch(updateMetaData('triage', 'basicMeasurements', newQuestions));
  }

  return basicMeasurements;
};

/**
 * Get questions for Test
 * Update metadata
 */
export const questionsTests = (algorithm) => {
  const medicalCase = store.getState();
  let assessmentTest = [];

  assessmentTest = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.assessment,
      },
    ],
    'OR',
    'array',
    !algorithm.is_arm_control
  );

  const newQuestions = assessmentTest.map(({ id }) => id);

  // Update state$ tests questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.tests.tests, newQuestions)) {
    store.dispatch(updateMetaData('tests', 'tests', newQuestions));
  }

  return assessmentTest;
};

/**
 * Get health cares
 * @param algorithm
 * @returns {*}
 */
export const healthCares = (algorithm) => {
  const medicalCase = store.getState();

  const healthCares = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'category',
        operator: 'equal',
        value: categories.drug,
      },
      {
        by: 'category',
        operator: 'equal',
        value: categories.management,
      },
    ],
    'OR',
    'array',
    false
  );

  return healthCares;
};

export const questionsRegistration = (algorithm) => {
  const medicalCase = store.getState();

  // Get nodes to display in registration stage
  const registrationQuestions = nodeFilterBy(
    medicalCase,
    algorithm,
    [
      {
        by: 'stage',
        operator: 'equal',
        value: stages.registration,
      },
    ],
    'OR',
    'array',
    false
  );

  const newQuestions = registrationQuestions.map(({ id }) => id);

  // Update state$ tests questions if it's different from new questions list
  if (!_.isEqual(medicalCase.metaData.patientupsert.custom, newQuestions)) {
    store.dispatch(updateMetaData('patientupsert', 'custom', newQuestions));
  }

  return registrationQuestions;
};
