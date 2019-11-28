import find from 'lodash/find';
import * as _ from 'lodash';
import { nodesType } from '../constants';
import { updateConditionValue } from '../actions/creators.actions';
import { calculateCondition, comparingTopConditions, reduceConditionArrayBoolean } from './algoConditionsHelpers';

/**
 * Get the parents for an instance in a diagnostic
 * Can be multiple nodes
 *
 * @param state$ : {Object}
 * @param diagnosticId {Number}
 * @param nodeId {Number}
 * @return {Array}
 */
export const getParentsNodes = (state$, diagnosticId, nodeId) => {
  let parentsNodes = [];

  let top_conditions = state$.value.diagnostics[diagnosticId].instances[nodeId].top_conditions;

  top_conditions.map((top) => {
    parentsNodes.push(top.first_node_id);
    if (top.second_type !== null) {
      parentsNodes.push(top.second_node_id);
    }
  });

  return parentsNodes;
};

/**
 * Process the final QS
 *
 * If this is a direct link, get condition in the QS conditon
 *
 * @param instance {Object} : The node we are working
 * @param finalQs {Object} : The child of the link, in this case this is the final Qs
 * @return {boolean|false|true|null}
 */
export const nextChildFinalQs = (instance, finalQs) => {
  let top_conditions = _.filter(finalQs.top_conditions, (top_condition) => top_condition.first_node_id === instance.id);
  // We get the condition of the final link
  let arrayBoolean = top_conditions.map((condition) => {
    return comparingTopConditions(finalQs, condition);
  });

  return reduceConditionArrayBoolean(arrayBoolean);
};

/**
 *  Process child other QS
 *  3 ways possible
 *    1 - Not answered AND not shown
 *      - Update condition Value to true
 *      - Get the status of the sub QS (Update the child in this QS by the way)
 *    2 - Not answered AND shown
 *      - Still possible we wait on the user
 *    3 - Answered AND shown.
 *      - The instance is good Go deeper in the algo
 *    4 - Answered AND not shwon
 *      - Return false because the top_parent condition is not respected
 *
 * The reset Qs is not here !
 *
 * @param state$  {Object}
 * @param child  {Object}
 * @param childConditionValue {Object}
 * @param qs  {Object}: Global QS
 * @param actions  {Object}: Array redux
 * @return {null|false|true}
 */
export const nextChildOtherQs = (state$, child, childConditionValue, qs, actions) => {
  /**
   *  If the sub QS has not a defined value yet, we update the sub Qs
   */
  if (child.answer === null) {
    getQuestionsSequenceStatus(state$, state$.value.nodes[child.id], actions);
  }

  /**
   * Continue the algo
   * The recursiveNodeQs function will do all the sub action like change condition value
   */
  return recursiveNodeQs(state$, qs.instances[child.id], qs, actions);
};

/**
 * Iterate the children and do action depending the child
 * Can be the QS (reach the end of tree) -> nextChildFinalQs()
 * Can be an other Qs -> nextChildOtherQs()
 * Can be an question -> go deeper in the branch
 *
 * @param state$ {Object}: store redux
 * @param instance {Object}: the instance node (parent of children)
 * @param qs {Object}: Question sequence
 * @param actions {Array}: Actions array redux
 * @param currentNode {Object}: Node
 *
 *  @return boolean : the status of children
 */
const InstanceChildrenOnQs = (state$, instance, qs, actions, currentNode) => {
  return instance.children.map((childId) => {
    let child = state$.value.nodes[childId];

    let childConditionValue;

    // If this is not the final QS we calculate the conditonValue of the child
    if (child.id !== qs.id) {
      childConditionValue = find(child.qs, (q) => q.id === qs.id).conditionValue;

      // Reset the child condition value
      if (currentNode.answer === null && childConditionValue === true) {
        // Can be an question or other QS
        actions.push(updateConditionValue(child.id, qs.id, false, qs.type));
      }
    }

    /**
     * If the child is the current QS
     */
    if (child.id === qs.id && child.type === nodesType.questionsSequence) {
      // The branch is open and we can set the answer of this QS
      return nextChildFinalQs(instance, child, qs);
    }
    if (child.type === nodesType.questionsSequence) {
      return nextChildOtherQs(state$, child, childConditionValue, qs, actions);
    } else if (child.type === nodesType.question) {
      return recursiveNodeQs(state$, qs.instances[child.id], qs, actions);
    } else {
      console.warn(
        '%c --- DANGER --- ',
        'background: #FF0000; color: #F6F3ED; padding: 5px',
        'This QS',
        qs,
        'You do not have to be here !! child in QS is wrong for : ',
        child
      );
    }
  });
};

/**
 * Calculate and update questions sequence and their children condition value
 *
 * @trigger When a condition value must be change
 * @payload nodeId: Question or QuestionsSequence
 * @payload callerId: Diagnostic or QuestionsSequence
 * @payload value: new condition value
 * @payload type: define if it's a diagnostic or a question sequence
 */
const recursiveNodeQs = (state$, instance, qs, actions) => {
  let isReset = false;
  /**
   * Initial Var
   */
  let currentNode = state$.value.nodes[instance.id];
  let instanceConditionValue = find(currentNode.qs, (p) => p.id === qs.id).conditionValue;

  /**
   * Get the condition of the instance link
   */
  let instanceCondition = calculateCondition(instance);
  if (instanceCondition === null) instanceCondition = false;

  /**
   * Update condition Value if the instance has to be shown
   */
  if (instanceConditionValue === false && instanceCondition === true) {
    actions.push(updateConditionValue(instance.id, qs.id, true, qs.type));
  }

  /**
   * Reset condition value
   * Hide the node if the instance condition is no longer valid BUT he was already shown
   */
  if (instanceConditionValue === true && instanceCondition === false) {
    isReset = true;
    actions.push(updateConditionValue(instance.id, qs.id, false, qs.type));
  }

  /**
   * Not shown before and the link condition is false -> return false
   */
  if (instanceConditionValue === false && instanceCondition === false) return false;

  /**
   * We process the instance children if
   * The condition is true AND The questions has an answer OR this is a top level node
   */

  if ((instanceCondition === true && (currentNode.answer !== null || instance.top_conditions.length === 0)) || isReset) {
    /**
     * From this point we can process all children and go deeper in the tree
     * ProcessChildren return the boolean array of each branch
     */
    let processChildren = InstanceChildrenOnQs(state$, instance, qs, actions, currentNode);

    return reduceConditionArrayBoolean(processChildren);

    /**
     *  Here we have parcoured all the children
     */
  } else {
    // The node hasn't the expected answer BUT we are not a the end of the QS
    return null;
  }
};

/**
 * 1. Get all nodes without conditons
 * 2. On each node we do work on his children (like change conditon value or check conditon of the child)
 * 3. Update Recursive QS
 *
 * @params state$: All the state of the reducer
 * @params qs: The QS we want to get the status
 * @params actions: The array of Redux Actions
 *
 * @return boolean: return the status of the QS
 *      true = can reach the end
 *      null = Still possible but not yet
 *      false = can't access the end anymore
 */
export const getQuestionsSequenceStatus = (state$, qs, actions) => {
  let topLevelNodes = [];

  // Set top Level Nodes
  Object.keys(qs.instances).map((nodeId) => {
    if (qs.instances[nodeId].top_conditions.length === 0) {
      topLevelNodes.push(qs.instances[nodeId]);
    }
  });

  let allNodesAnsweredInQs = topLevelNodes.map((topNode) => recursiveNodeQs(state$, topNode, qs, actions));

  return reduceConditionArrayBoolean(allNodesAnsweredInQs);
};

export const getStatusOfDD = (state$, dd) => {
  let topLevelNodes = [];
  let instancesOfDiagnosticByDd = state$.diagnostics[dd.diagnostic_id].instances;
  // Set top Level Nodes
  Object.keys(instancesOfDiagnosticByDd).map((instanceId) => {
    if (instancesOfDiagnosticByDd[instanceId].top_conditions.length === 0 && instancesOfDiagnosticByDd[instanceId].final_diagnostic_id === null) {
      topLevelNodes.push(instancesOfDiagnosticByDd[instanceId]);
    }
  });

  let allNodesAnsweredInDd = topLevelNodes.map((topNode) => recursiveNodeDd(state$, topNode, dd));

  return reduceConditionArrayBoolean(allNodesAnsweredInDd);
};

/**
 * 1. Get all nodes without conditons
 *
 * @params state$: All the state of the reducer
 * @params dd: The Final Diagnostics we want to get the status
 *
 * @return boolean: return the status of the DD
 *      true = can reach the end
 *      null = Still possible but not yet
 *      false = can't access the end anymore
 */
export const recursiveNodeDd = (state$, instance, dd) => {
  /**
   * Initial Var
   */
  let currentNode = state$.nodes[instance.id];
  let instanceConditionValue = find(currentNode.dd, (p) => p.id === dd.diagnostic_id).conditionValue;

  /**
   * Get the condition of the instance link
   */
  let instanceCondition = calculateCondition(instance);

  // The condition path is not answered
  // Wait on user
  if (currentNode.answer === null && instanceCondition === true) {
    return null;
  }

  // The condition path is not respected so we cant go deeper
  if (instanceCondition === false && instanceConditionValue === false) {
    return false;
  }
  // The condition path is not answered
  // Wait on user
  if (instanceCondition === null) {
    return null;
  }
  // Remove path other dd
  let childrenWithoutOtherDd = instance.children.filter((id) => {
    if (state$.nodes[id].type === nodesType.finalDiagnostic && state$.nodes[id].id !== dd.id) {
      return false;
    }
    return true;
  });

  let recursif = childrenWithoutOtherDd.map((childId) => {
    let child = state$.nodes[childId];
    // If this is not the final QS we calculate the conditonValue of the child
    if (child.type === nodesType.question || child.type === nodesType.questionsSequence) {
      // childConditionValue = find(child.qs, (q) => q.id === qs.id).conditionValue;
      return recursiveNodeDd(state$, state$.diagnostics[dd.diagnostic_id].instances[child.id], dd);
    } else if (child.id === dd.id && child.type === nodesType.finalDiagnostic) {
      let top_conditions = _.filter(dd.top_conditions, (top_condition) => top_condition.first_node_id === instance.id);
      // We get the condition of the final link
      let arrayBoolean = top_conditions.map((condition) => {
        return comparingTopConditions(dd, condition);
      });
      // calcule final path
      let r = reduceConditionArrayBoolean(arrayBoolean);
      return r;
    }
  });

  return reduceConditionArrayBoolean(recursif);
};
