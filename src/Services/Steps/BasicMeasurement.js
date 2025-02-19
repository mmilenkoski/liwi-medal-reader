/**
 * The internal imports
 */
import { store } from '@/Store'
import { getYesAnswer } from '@/Utils/Answers'

export default () => {
  const state = store.getState()
  const order = state.algorithm.item.config.full_order.basic_measurements_step
  const nodes = state.algorithm.item.nodes
  const mcNodes = state.medicalCase.item.nodes

  const questionsId = order.filter(questionId => {
    if (nodes[questionId].conditioned_by_cc.length > 0) {
      // If one of the CC is true it means we need to exclude the question
      return nodes[questionId].conditioned_by_cc.some(
        ccId => mcNodes[ccId].answer === getYesAnswer(nodes[ccId]).id,
      )
    }
    return true
  })

  // Adding Reference table to the view
  return questionsId.concat(
    Object.values(nodes)
      .filter(node => {
        if (node.reference_table_x_id) {
          // Display reference table question to view if it's not conditioned by any cc
          if (node.conditioned_by_cc.length > 0) {
            return node.conditioned_by_cc.some(
              ccId => mcNodes[ccId].answer === getYesAnswer(nodes[ccId]).id,
            )
          }

          return true
        }
      })
      .map(node => node.id),
  )
}
