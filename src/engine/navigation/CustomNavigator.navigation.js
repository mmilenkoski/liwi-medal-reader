import React from 'react';
import _ from 'lodash';
import { RootMainNavigator } from './Root.navigation';
import { medicalCaseStatus, navigationActionConstant, routeDependingStatus } from '../../../frontend_service/constants';
import NavigationService from './Navigation.service';
import { store } from '../../../frontend_service/store';
import { updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';
import { Toaster } from '../../utils/CustomToast';
import {
  questionsBasicMeasurements,
  questionsComplaintCategory,
  questionsFirstLookAssessement,
  questionsMedicalHistory,
  questionsPhysicalExam,
  questionsTests,
} from '../../../frontend_service/algorithm/questionsStage.algo';

const screens = [
  { key: 'Home' },
  {
    key: 'PatientUpsert',
    medicalCaseOrder: 0,
    validations: {
      custom: { is_mandatory: true },
    },
  },
  {
    key: 'Triage',
    medicalCaseOrder: 1,
    validations: {
      firstLookAssessments: { is_mandatory: true, initialPage: 0 },
      complaintCategories: { answer: 'not_null', initialPage: 1, required: true },
      basicMeasurements: { is_mandatory: true, initialPage: 2 },
    },
    generateQuestions: [questionsFirstLookAssessement, questionsComplaintCategory, questionsBasicMeasurements],
  },
  {
    key: 'Consultation',
    medicalCaseOrder: 2,
    validations: { medicalHistory: { is_mandatory: true, initialPage: 0 }, physicalExam: { is_mandatory: true, initialPage: 1 } },
    generateQuestions: [questionsPhysicalExam, questionsMedicalHistory],
  },
  { key: 'Tests', medicalCaseOrder: 3, validations: {}, generateQuestions: [questionsTests] },
  { key: 'DiagnosticsStrategy', medicalCaseOrder: 4, validations: {} },
];

const modelValidator = {
  isActionValid: true,
  routeRequested: null,
  stepToBeFill: [],
  screenToBeFill: [],
  questionsToBeFill: [],
  mustFinishStage: false,
};

/**
 * Return the validation for the given step
 *
 * @param route : route from navigation
 * @param lastState : lastState from state navigation
 * @param validator : object contain all validation
 * @return validator : may be updated in the function
 */
const validatorStep = (route, lastState, validator) => {
  const state$ = store.getState();

  if (route?.params?.initialPage && route.params.initialPage > 0) {
    const detailSetParamsRoute = screens.find((s) => s.key === route.routeName);
    const detailValidation = _.findKey(detailSetParamsRoute.validations, (v) => v.initialPage === route.params.initialPage - 1);

    let questionsToValidate = state$.metaData[route.routeName.toLowerCase()];

    let questions = questionsToValidate[detailValidation];
    let criteria = detailSetParamsRoute.validations[detailValidation];

    validator = oneValidation(criteria, questions, detailValidation);
  }

  return validator;
};

/**
 * Return one validation inside an stage
 * ex : Step firstLookAssessments
 *
 * @param criteria : object from the constant screens
 * @param questions : questions used to validation
 * @param stepName : stepName : step to validate
 * @return {validator} :
 */
function oneValidation(criteria, questions, stepName) {
  let state$ = store.getState();
  let result;
  let isValid = true;
  // Break Ref JS
  let staticValidator = JSON.parse(JSON.stringify(modelValidator));
  staticValidator.stepName = stepName;

  Object.keys(criteria).map((c) => {
    switch (c) {
      case 'is_mandatory':
        questions.forEach((questionId) => {
          let q = state$.nodes[questionId];
          if (q.is_mandatory === true) {
            result = state$.nodes[questionId].answer !== null || state$.nodes[questionId].value !== null;
            if (!result) {
              isValid = false;
              staticValidator.questionsToBeFill.push(state$.nodes[questionId]);
            }
          }
        });
        break;
      case 'answer':
        if (criteria[c] === 'not_null') {
          questions.forEach((questionId) => {
            let q = state$.nodes[questionId];
            result = q.answer !== null;
            if (!result) {
              isValid = false;
              staticValidator.questionsToBeFill.push(q);
            }
          });
        }
        break;
      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }
  });
  // Need all condition to true
  staticValidator.isActionValid = isValid;
  return staticValidator;
}

/**
 *  Defined all the logic for validation on navigation based on redux status
 *
 *
 * @param navigateRoute : action from react navigation
 * @param lastState
 * @return {any}
 */
const validatorNavigate = (navigateRoute) => {
  // Break Ref JS
  let validator = JSON.parse(JSON.stringify(modelValidator));

  /** Forced navigation **/
  if (navigateRoute?.params?.force !== undefined && navigateRoute?.params?.force === true) {
    validator.isActionValid = true;
    return validator;
  }

  let state$ = store.getState();

  // Get validation from constant
  const detailNavigateRoute = screens.find((s) => s.key === navigateRoute.routeName);

  /** This route has no rule **/
  if (detailNavigateRoute === undefined || detailNavigateRoute === null) {
    validator.isActionValid = true;
    return validator;
  }

  /*** ----- Specific Validation -----  ***/

  /** This route is patientUpSert **/
  if (detailNavigateRoute.medicalCaseOrder === 0) {
    validator.isActionValid = true;
    return validator;
  }

  /** MedicalCases Routes **/

  if (detailNavigateRoute.medicalCaseOrder !== undefined) {
    /** the case is still in creation, do not permit to go into medical case **/
    if (detailNavigateRoute.medicalCaseOrder > 0 && state$.isNewCase === true) {
      validator.isActionValid = false;
      return validator;
    }

    // Route depending status
    let routeToValidate = screens.find((s) => s.key === routeDependingStatus(state$));

    /** The route requested is the route to validate  **/
    if (routeToValidate.key === detailNavigateRoute.key) {
      validator.isActionValid = true;
      return validator;
    }

    // Route to validate is not null and can be validated
    if (routeToValidate !== undefined) {
      // Questions to be validated
      let questionsToValidate = state$.metaData[routeToValidate.key.toLowerCase()];

      // Get order of screen
      let indexStatus = _.find(medicalCaseStatus, (i) => i.name === state$.status).main;

      let requestedStatus = screens.find((s) => s.key === navigateRoute.routeName).medicalCaseOrder;

      // Diff between prev and next index in order
      let diffStatus = requestedStatus - indexStatus;

      /** Route is before so ok */
      if (diffStatus <= 0) {
        validator.isActionValid = true;
        return validator;
      }

      // Check route to validate screen if valid
      let screenResults = Object.keys(routeToValidate.validations).map((validation) => {
        let questions = questionsToValidate[validation];
        let criteria = routeToValidate.validations[validation];
        // Validation on each Step
        return oneValidation(criteria, questions, validation);
      });

      // All step has to be valide
      validator.isActionValid = screenResults.every((c) => c.isActionValid === true);
      validator.stepToBeFill = screenResults;

      if (!validator.isActionValid) {
        validator.routeRequested = navigateRoute.routeName;
        validator.screenToBeFill = routeToValidate.key;
      }

      /**
       * if route requested is min 2 step too long AND the routeToValidate is true
       * Pre-generate the questions for the stage concerned and test it !
       */
      if (diffStatus > 1 && validator.isActionValid === true) {
        // Get the next route from the route to validate
        const prevRoute = screens.find((w) => w.medicalCaseOrder === routeToValidate.medicalCaseOrder + 1);

        // As the questions for the views have not yet been generated, we are doing it now to validate them.
        prevRoute.generateQuestions.map((func) => func());

        // Get the new state updated by the last function
        state$ = store.getState();

        // Get the id to validated
        const prevRoutequestionsToValidate = state$.metaData[prevRoute.key.toLowerCase()];

        // Check route to validate screen if valid
        screenResults = Object.keys(prevRoute.validations).map((validation) => {
          let questions = prevRoutequestionsToValidate[validation];
          let criteria = prevRoute.validations[validation];
          // Validation on each Step
          return oneValidation(criteria, questions, validation);
        });

        // All step has to be valide
        validator.isActionValid = screenResults.every((c) => c.isActionValid === true);
        validator.stepToBeFill = screenResults;

        // If not set the strings
        if (!validator.isActionValid) {
          validator.routeRequested = navigateRoute.routeName;
          validator.screenToBeFill = prevRoute.key;
        }
      }

      return validator;
    }
  }
  return validator;
};

class CustomNavigator extends React.Component {
  static router = {
    ...RootMainNavigator.router,
    getStateForAction: (action, lastState) => {
      // https://reactnavigation.org/docs/en/custom-routers.html#getstateforactionaction-state
      // check for custom actions and return a different navigation state.
      let validation = {
        isActionValid: true,
      };
      const route = NavigationService.getActiveRouteByKey(action, lastState);
      const currentRoute = NavigationService.getCurrentRoute();
      const detailSetParamsRoute = screens.find((s) => s.key === route.routeName);
      const detailValidation = _.findKey(detailSetParamsRoute.validations, (v) => v.initialPage === route.params.initialPage - 1);

      switch (action.type) {
        case navigationActionConstant.navigate:
        case navigationActionConstant.replace:
          // eslint-disable-next-line no-case-declarations
          validation = validatorNavigate(action);
          break;

        case navigationActionConstant.setParams:
          validation = validatorStep(route, lastState, modelValidator);

          /** Change route params and dont block action **/
          if (validation.isActionValid === false && detailSetParamsRoute.validations[detailValidation]?.required === true) {
            action.params.initialPage = detailSetParamsRoute.validations[detailValidation].initialPage;
            Toaster(detailValidation + ' are invalid', { type: 'danger' }, { duration: 50000 });
            return RootMainNavigator.router.getStateForAction(action, lastState);
          } else if (route.routeName === currentRoute.routeName) {
            // If the set params is on the same route and has no required
            validation.isActionValid = true;
          }

          break;
      }

      if (validation.isActionValid) {
        return RootMainNavigator.router.getStateForAction(action, lastState);
      } else {
        store.dispatch(updateModalFromRedux(null, validation));
        return null;
      }
    },
  };

  state = {};

  render() {
    const { navigation } = this.props;

    return <RootMainNavigator navigation={navigation} />;
  }
}

export default CustomNavigator;
