/**
 * The internal imports
 */
import { store } from '@/Store'

export default () => {
  const state = store.getState()
  return state.algorithm.item.config.full_order.first_look_assessment_step
}
