import find from 'lodash/find';
import * as _ from 'lodash';
import { nodeTypes } from '../constants';
import { updateConditionValue } from './epics.algo';
import { calculateCondition, comparingTopConditions, reduceConditionArrayBoolean } from './conditionsHelpers.algo';

/**
 * Get the parents for an instance in a diagnostic
 * Can be multiple nodes
 *
 * @param state$ : {Object}
 * @param diagnosticId {Number}
 * @param nodeId {Number}
 * @return {Array}
 */
export const getParentsNodes = (algorithm, diagnosticId, nodeId) => {
  const { top_conditions } = algorithm.diagnostics[diagnosticId].instances[nodeId];

  const parentsNodes = [];

  top_conditions.map((top) => parentsNodes.push(top.first_node_id));

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
export const nextChildFinalQs = (algorithm, instance, finalQs, medicalCase) => {
  const currentQuestionSequence = algorithm.nodes[finalQs.id];
  const top_conditions = _.filter(currentQuestionSequence.top_conditions, (top_condition) => top_condition.first_node_id === instance.id);
  // We get the condition of the final link
  const arrayBoolean = top_conditions.map((condition) => {
    return comparingTopConditions(condition, medicalCase);
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
export const nextChildOtherQs = (algorithm, medicalCase, child, childConditionValue, qs) => {
  const currentQs = algorithm.nodes[qs.id];

  //  If the sub QS has not a defined value yet, we update the sub Qs
  if (child.answer === null) {
    getQuestionsSequenceStatus(algorithm, medicalCase, medicalCase.nodes[child.id]);
  }

  // The recursiveNodeQs function will do all the sub action like change condition value
  return recursiveNodeQs(algorithm, medicalCase, currentQs.instances[child.id], qs);
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
const InstanceChildrenOnQs = (algorithm, medicalCase, instance, mcQs, currentNode) => {
  const currentQs = algorithm.nodes[mcQs.id];
  return instance.children.map((childId) => {
    const mcNode = medicalCase.nodes[childId];

    let childConditionValue;

    // If this is not the final QS we calculate the conditionValue of the mcNode
    if (mcNode.id !== mcQs.id) {
      childConditionValue = find(mcNode.qs, (q) => q.id === mcQs.id).conditionValue;

      // Reset the mcNode condition value
      if (currentNode.answer === null && childConditionValue === true) {
        // Can be an question or other QS
        updateConditionValue(algorithm, medicalCase, mcNode.id, mcQs.id, false, mcQs.type);
      }
    }

    // If the mcNode is the current QS
    if (mcNode.id === mcQs.id && mcNode.type === nodeTypes.questionsSequence) {
      // The branch is open and we can set the answer of this QS
      return nextChildFinalQs(algorithm, instance, mcNode, medicalCase);
    }
    if (mcNode.type === nodeTypes.questionsSequence) {
      return nextChildOtherQs(algorithm, medicalCase, mcNode, childConditionValue, mcQs);
    }
    if (mcNode.type === nodeTypes.question) {
      return recursiveNodeQs(algorithm, medicalCase, currentQs.instances[mcNode.id], mcQs);
    }
    console.warn('%c --- DANGER --- ', 'background: #FF0000; color: #F6F3ED; padding: 5px', 'This QS', mcQs, 'You do not have to be here !! mcNode in QS is wrong for : ', mcNode);
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
const recursiveNodeQs = (algorithm, medicalCase, instance, mcQs) => {
  let isReset = false;

  // Initial Var
  const currentNode = algorithm.nodes[instance.id];
  const mcNode = medicalCase.nodes[instance.id];
  const instanceConditionValue = find(currentNode.qs, (p) => p.id === mcQs.id).conditionValue;

  // If all the conditionValues of the QS are false we set the conditionValues of the node to false
  const qsInstances = mcQs.dd.concat(mcQs.qs);
  const qsConditionValue = qsInstances.some((qsInstance) => qsInstance.conditionValue);

  //  Get the condition of the instance link
  let instanceCondition = qsConditionValue && calculateCondition(algorithm, instance, medicalCase);
  if (instanceCondition === null) instanceCondition = false;
  // Update condition Value if the instance has to be shown
  if (instanceConditionValue === false && instanceCondition === true) {
    updateConditionValue(algorithm, medicalCase, instance.id, mcQs.id, true, mcQs.type);
  }

  // Reset condition value / Hide the node if the instance condition is no longer valid BUT he was already shown
  if (instanceConditionValue === true && instanceCondition === false) {
    isReset = true;
    updateConditionValue(algorithm, medicalCase, instance.id, mcQs.id, false, mcQs.type);
  }

  // Not shown before and the link condition is false -> return false
  if (instanceConditionValue === false && instanceCondition === false) return false;

   // We process the instance children if the condition is true AND The questions has an answer OR this is a top level node
  if ((mcNode.answer !== null || instance.top_conditions.length === 0) || isReset) {
    // From this point we can process all children and go deeper in the tree processChildren return the boolean array of each branch
    const processChildren = InstanceChildrenOnQs(algorithm, medicalCase, instance, mcQs, mcNode);
    return reduceConditionArrayBoolean(processChildren);
  }
  // The node hasn't the expected answer BUT we are not a the end of the QS
  return null;
};

/**
 * 1. Get all nodes without conditons
 * 2. On each node we do work on his children (like change condition value or check condition of the child)
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
export const getQuestionsSequenceStatus = (algorithm, medicalCase, mcQs) => {
  const topLevelNodes = [];
  const currentNode = algorithm.nodes[mcQs.id];
  // Set top Level Nodes
  Object.keys(currentNode.instances).forEach((nodeId) => {
    if (currentNode.instances[nodeId].top_conditions.length === 0) {
      topLevelNodes.push(currentNode.instances[nodeId]);
    }
  });

  const allNodesAnsweredInQs = topLevelNodes.map((topNode) => {
    return recursiveNodeQs(algorithm, medicalCase, topNode, mcQs);
  });

  return reduceConditionArrayBoolean(allNodesAnsweredInQs);
};

/**
 * @params diagnoses: New diagnoses will be placed into state
 * @params drugs: all the drugs selected manually
 *
 * Remove drugs from manually if new diagnoses contain this drug (no duplicate !)
 */
export const newDrugsFilter = (diagnoses, drugs) => {
  const newDrugs = { ...drugs };
  const keyToRemove = [];

  Object.keys(diagnoses).map((key) => {
    Object.keys(diagnoses[key].drugs).map((drugKey) => {
      // If the drug was already selected manually
      if (drugs[drugKey] !== undefined) {
        keyToRemove.push(drugKey);
      }
    });
  });
  // Delete by key
  keyToRemove.forEach((e) => delete newDrugs[e]);
  return newDrugs;
};
