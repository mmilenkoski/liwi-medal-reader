import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import MedicalHistory from '@/Services/Steps/MedicalHistory'

export default {
  initialState: buildAsyncState('medicalHistory'),
  action: buildAsyncActions(
    'questionsPerSystem/medicalHistory',
    MedicalHistory,
  ),
  reducers: buildAsyncReducers({
    errorKey: 'medicalHistory.error',
    loadingKey: 'medicalHistory.loading',
  }),
}
