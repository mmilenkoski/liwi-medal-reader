import { ofType } from 'redux-observable';
import find from 'lodash/find';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { actions } from '../../actions/types.actions';
import { nodesType } from '../../constants';
import {
  conditionValueDiseasesChange,
  diagnosisChildren,
  diseasesChildren,
  dispatchNodeAction,
  questionsSequencesChildren,
  setAnswer,
} from '../../actions/creators.actions';
import {
  getParentsOfThisNode,
  getStateToThisPs,
  nodeConditionChecker,
} from '../../algorithm/algoTreeDiagnosis';

/* REMEMBER: When an Epic receives an action, it has already been run through your reducers and the state is updated.*/

/**
* Loop on diagnostics AND PS
*
* @params [Object] action$, [Object] state$
* @return [Array][Object] arrayActions
**/
// TODO make PS change side effect
export const epicCatchAnswer = (action$, state$) =>
  action$.pipe(
    ofType(actions.SET_ANSWER),
    switchMap((action) => {
      // Index is the id of the node that has just been answered
      const { index } = action.payload;

      // eslint-disable-next-line no-console
      console.log(
        '%c ########################  epicCatchAnswer ########################',
        'background: #F6F3EE; color: #b84c4c; padding: 5px'
      );

      // eslint-disable-next-line no-console
      console.log({ STATE: state$.value });

      const currentNode = state$.value.nodes[index];
      const relatedDiagnostics = currentNode.dd;
      const relatedQuestionsSequence = currentNode.qs;

      let arrayActions = [];

      relatedDiagnostics.map((diagnostic) =>
        arrayActions.push(dispatchNodeAction(currentNode, state$.value.diagnostics[diagnostic.id]))
      );

      relatedQuestionsSequence.map((questionsSequence) =>
        arrayActions.push(questionsSequencesChildren(questionsSequence.id, index))
      );

      return of(...arrayActions);
    })
  );

/**
* Process the impacted node according to his type
*
* @params [Object] action$, [Object] state$
* @return [Array][Object] arrayActions
**/
// TODO : Handle HealthCares
export const epicCatchDispatchNodeAction = (action$, state$) =>
  action$.pipe(
    ofType(actions.HANDLE_NODE_CHANGED),
    switchMap((action) => {
      let arrayActions = [];

      // Caller = dd or qs being affected by the node
      let { node, caller } = action.payload;

      // eslint-disable-next-line no-console
      console.log(
        '%c --- epicCatchDispatchNodeAction --- ',
        'background: #FF4500; color: #F6F3ED; padding: 5px',
        'déclenché :',
        node,
        ' > : ',
        caller,
      );

      let nodeChildren;

      // What do we do with this child -> switch according to type
      switch (caller.type) {
        case nodesType.question:
          return of(diseasesChildren(node.id, caller.id));
        case nodesType.finalDiagnostic:
          return of(diagnosisChildren(node.id, caller.id));
        case nodesType.healthCare:
          // TODO: to implement
          return [];
        case nodesType.diagnostic:

          // Get children of the node in the current diagnostic
          nodeChildren = caller.nodes[node.id].children;

          // Check children of the node in the current diagnostic and process them as well.
          nodeChildren.map((childId) => {
            arrayActions.push(
              dispatchNodeAction(
                caller,
                state$.value.nodes[childId] === undefined ? state$.value.diagnostics[childId] : state$.value.nodes[childId],
              )
            );
          });

          return of(...arrayActions);
        case nodesType.questionsSequence:
          // TODO : Handle PS
          // HERE calcule condition of node type PS
          return of(diseasesChildren(node.id, caller.id));
        //return of(questionsSequencesChildren(caller, node));
        default:
          // eslint-disable-next-line no-console
          console.log(
            '%c --- DANGER --- ',
            'background: #FF0000; color: #F6F3ED; padding: 5px',
            'nodes type ',
            caller.type,
            'doesn\'t exist'
          );
          return [];
      }
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// TODO : finish it
export const epicCatchPredefinedSyndromeChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_QUESTIONS_SEQUENCES_CHILDREN),
    switchMap((action) => {
      // Processed with a PS
      const { indexPS, indexChild } = action.payload;

      // Here get the state if this PS
      const qs = state$.value.nodes[indexPS];

      // Let check the condition of this qs
      const topConditionCheckerPs = nodeConditionChecker(
        state$,
        null,
        null,
        qs
      );

      let answeredId = null;
      let actions = [];

      if (topConditionCheckerPs === true) {
        answeredId = qs.answers[Object.keys(qs.answers)[0]].id;
      } else if (topConditionCheckerPs === false) {
        answeredId = qs.answers[Object.keys(qs.answers)[1]].id;
      } else if (topConditionCheckerPs === null) {
        // TODO if top parent question is reset to null, reset children question condition value to false
        getStateToThisPs(state$, qs, actions);
      }

      // eslint-disable-next-line no-console
      console.log(
        'starte PS :',
        qs.id,
        qs,
        topConditionCheckerPs,
        'state du qs :',
        actions,
        'index child :',
        indexChild
      );
      // eslint-disable-next-line no-console
      console.log(indexPS, ' -> ce PS a comme réponse : ', answeredId);

      if (answeredId !== qs.answer) {
        // actions.push(dispatchNodeAction(qs.id, indexChild, qs.type));

        return of(...actions, setAnswer(qs.id, answeredId));
      } else {
        // emit nothing....
        return of(...[]);
      }
    })
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Process final diagnostic by checking his conditions then process its health cares
export const epicCatchDiagnosisChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_DIAGNOSIS_CHILDREN),
    switchMap((action) => {
      const { indexDD, indexDiagnosis } = action.payload;
      const child = state$.value.nodes[indexDiagnosis];

      // Get the conditions of the node
      const condition = nodeConditionChecker(
        state$,
        indexDD,
        indexDiagnosis,
        child
      );

      // eslint-disable-next-line no-console
      console.log(indexDD, '-> conditon of this final node', condition);
      // Check the condition of the children
      return of(...[]);
    })
    // TODO : Trigger Treatment/Management handling
  );

// @params [Object] action$, [Object] state$
// @return [Array][Object] arrayActions
// Process node children in the dd
export const epicCatchDiseasesChildren = (action$, state$) =>
  action$.pipe(
    ofType(actions.MC_DISEASES_CHILDREN),
    switchMap((action) => {
      const { indexDD, indexChild } = action.payload;
      const child = state$.value.diagnostics[indexDD].nodes[indexChild];
      // If the algo is wrong with the nodes
      // TODO catch nice error from JSON
      if (child === undefined) {
        console.error(
          ' The child',
          indexChild,
          'do not exist in diagnostics',
          indexDD
        );
        return of();
      }

      // Get the conditions of the node
      const condition = nodeConditionChecker(
        state$,
        indexDD,
        indexChild,
        child
      );
      let actions = [];

      // console.log('node', indexChild, ' is ', condition, 'for', indexDD);

      // let findActuelConditionValue = findIndex(
      //   state$.value.nodes[indexChild].dd,
      //   (o) => o.id === indexDD
      // );

      let parents = getParentsOfThisNode(state$, indexDD, indexChild);

      // some() – returns true if the function returns true for at least one of the items
      // If one parents has to be show and answered
      let finder = parents.some((i) => {
        let node = state$.value.nodes[i];
        let diagnostic = find(node.dd, (p) => p.id === indexDD);
        return node.answer !== null && diagnostic.conditionValue === true;
      });

      // Update the condition value if it is different from the current one
      // if (
      //   state$.value.nodes[indexChild].dd[findConditionValue].conditionValue !==
      //   condition
      // ) {
      // IF the node is always possible we do nothing

      // IF the condition is not null

      if (condition !== null) {
        actions.push(
          conditionValueDiseasesChange(indexChild, indexDD, condition)
        );

        // if the node is answered we go deeper
        if (state$.value.nodes[indexChild].answer !== null) {
          actions.push(dispatchNodeAction(indexChild, indexDD, nodesType.diagnostic));
        }
      } else if (finder === false) {
        // reset conditionValue to false
        actions.push(conditionValueDiseasesChange(indexChild, indexDD, false));
      }

      return of(...actions);
    })
  );
