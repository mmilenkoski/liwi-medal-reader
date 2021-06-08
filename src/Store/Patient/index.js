import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Create from './Create'
import UpdateField from './UpdateField'
import Load from './Load'

const sliceInitialState = {
  item: {},
}

export default buildSlice(
  'patient',
  [Create, UpdateField, Load],
  sliceInitialState,
).reducer
