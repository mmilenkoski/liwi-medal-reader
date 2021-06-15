/**
 * The external imports
 */
import { createAction } from '@reduxjs/toolkit'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInMonths from 'date-fns/differenceInMonths'

/**
 * The internal imports
 */
import { handleNumeric } from '@/Utils/MedicalCase'

export default {
  initialState: {},
  action: createAction('medicalCase/handleDateFormulas'),
  reducers(state, { payload: { birthDate, algorithm } }) {
    const {
      config: { birth_date_formulas },
      nodes,
    } = algorithm
    const createdAt = state.item.createdAt
    const mcNodes = state.item.nodes

    birth_date_formulas.forEach(nodeId => {
      const value =
        nodes[nodeId].formula.search('Month') > 0
          ? differenceInMonths(new Date(createdAt), new Date(birthDate))
          : differenceInDays(new Date(createdAt), new Date(birthDate))

      const newValue = handleNumeric(mcNodes[nodeId], nodes[nodeId], value)
      state.item.nodes[nodeId] = { ...state.item.nodes[nodeId], ...newValue }
    })
    return state
  },
}
