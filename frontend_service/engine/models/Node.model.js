// @flow
import NavigationService from 'engine/navigation/Navigation.service';
import React from 'react';
import findKey from 'lodash/findKey';
import _ from 'lodash';

import { categories, valueFormats } from '../../constants';
import { diagnosticIsExcludedByComplaintCategory } from './Diagnostic.model';

export class NodeModel {
  constructor(props) {
    const { id } = props;
    this.id = id;
  }

  displayValue = () => {
    return this.value;
  };

  /**
   * Update the answer depending his format
   *
   * @param {(string\|number)} value: new value for the question
   * @return  {Nothing} Update the class
   * Depending the value format of the question
   *
   * Float If float we find the right operator and calculate the new value
   *
   * List If list or array set the new value defined by the component button
   *
   */
  updateAnswer = (value, algorithm) => {
    let answer = null;
    const currentNode = algorithm.nodes[this.id];

    if (currentNode.category !== categories.basicMeasurement) {
      switch (currentNode.value_format) {
        case valueFormats.int:
        case valueFormats.float:
          if (value !== null) {
            answer = findKey(currentNode.answers, (answerCondition) => {
              switch (answerCondition.operator) {
                case 'more_or_equal':
                  return value >= Number(answerCondition.value);
                case 'less':
                  return value < Number(answerCondition.value);
                case 'between':
                  return value >= Number(answerCondition.value.split(',').first()) && value < Number(answerCondition.value.split(',').second());
              }
            });
            if (answer !== undefined) {
              answer = Number(answer);
            } else {
              answer = null;
            }
          } else {
            answer = null;
          }
          break;
        case valueFormats.string:
        case valueFormats.date:
          //  Nothing to do
          break;
        case valueFormats.bool:
        case valueFormats.array:
        case valueFormats.present:
        case valueFormats.positive:
          // Set Number only if this is a number
          if (value !== null) {
            answer = Number(value);
          } else {
            // Set the new answer to null for reset
            answer = value;
          }
          break;
        default:
          // eslint-disable-next-line no-console
          if (__DEV__) {
            console.log('%c --- DANGER --- ', 'background: #FF0000; color: #F6F3ED; padding: 5px', `Unhandled question format ${this.display_format}`, this);
          }
          answer = value;
          break;
      }
    } else {
      answer = null;
    }

    // Validation for integer and float type based on Medal-C config
    if (currentNode.value_format === valueFormats.int || currentNode.value_format === valueFormats.float) {
      if (value !== null && (value < currentNode.min_value_warning || value > currentNode.max_value_warning)) {
        // Warning
        if (value < currentNode.min_value_warning && currentNode.min_value_warning !== null) {
          this.validationMessage = currentNode.min_message_warning;
        }

        if (value > currentNode.max_value_warning && currentNode.max_value_warning !== null) {
          this.validationMessage = currentNode.max_message_warning;
        }

        this.validationType = 'warning';

        // Error
        if (value < currentNode.min_value_error || value > currentNode.max_value_error) {
          if (value < currentNode.min_value_error && currentNode.min_value_error !== null) {
            this.validationMessage = currentNode.min_message_error;
          }

          if (value > this.max_value_error && this.max_value_error !== null) {
            this.validationMessage = currentNode.max_message_error;
          }
          this.validationType = 'error';
        }
      } else {
        this.validationMessage = null;
        this.validationType = null;
      }
    }

    // Assign final value
    this.answer = answer;
    this.answer_stage = NavigationService.getCurrentRoute().routeName;
    this.value = value;
  };

  // TODO comment
  static filterByType(nodes, type) {
    return _.filter(nodes, (n) => n.type === type);
  }

  /**
   * Return filtered nodes on multiple params
   * @params filter : array
   * [{ by: 'category', operator: 'equal', value: categories.symptom },
   * { by: 'stage', operator: 'equal', value: stage.consultation },
   * { by: 'counter', operator: 'more', value: 0 },]
   *
   * @params operator string
   *  - AND
   *  - OR
   *
   *  @params formatReturn string
   *  - array
   *  - object
   */
  static filterBy(medicalCase, algorithm, filters, operator = 'OR', formatReturn = 'array', counter = true) {
    // return the boolean for one filter
    const switchTest = (filter, node) => {
      switch (filter.operator) {
        case 'equal':
          return algorithm.nodes[node.id][filter.by] === filter.value;
        case 'more':
          return algorithm.nodes[node.id][filter.by] > filter.value;
      }
    };

    const counterFilter = (filter, node) => {
      if (counter) {
        return switchTest(filter, node) && node.counter > 0;
      }
      return switchTest(filter, node);
    };

    const filterByConditionValue = (nodes) => {
      console.log(nodes)
      Object.keys(nodes).forEach((nodeId) => {
        console.log(algorithm.nodes)
        const { type } = algorithm.nodes[nodeId];
        if (type === 'Question') {
          nodes[nodeId].counter = 0;
          nodes[nodeId].dd.forEach((dd) => {
            !diagnosticIsExcludedByComplaintCategory(algorithm, dd.id) && dd.conditionValue ? nodes[nodeId].counter++ : null;
          });
          // Map trough PS if it is in an another PS itself
          nodes[nodeId].qs.forEach((qs) => {
            const relatedDiagnostics = nodes[qs.id].dd.some((diagnostic) => !diagnosticIsExcludedByComplaintCategory(algorithm, diagnostic.id));
            relatedDiagnostics && qs.conditionValue ? nodes[nodeId].counter++ : null;
          });
        }
      });
    };

    const { nodes } = medicalCase;
    filterByConditionValue(nodes);

    let methodFilteringLodash;

    // Set the right method depending the return format
    if (formatReturn === 'array') {
      // Return new array
      methodFilteringLodash = 'filter';
    } else if (formatReturn === 'object') {
      // Return object and keep key
      methodFilteringLodash = 'pickBy';
    }

    return _[methodFilteringLodash](nodes, (node) => {
      // The some() method tests whether at least one element in the array passes the test implemented by the provided function.
      // It returns a Boolean value.
      return filters.some((filter) => {
        return counterFilter(filter, node);
      });
    });
  }
}
