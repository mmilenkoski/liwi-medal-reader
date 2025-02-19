import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import FetchOne from './FetchOne'
import ChangeClinician from './ChangeClinician'
import Destroy from './Destroy'

const sliceInitialState = {
  item: {},
  clinician: {},
}

export default buildSlice(
  'healthFacility',
  [FetchOne, ChangeClinician, Destroy],
  sliceInitialState,
).reducer
