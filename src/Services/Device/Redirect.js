import { PermissionsAndroid } from 'react-native'
import { navigateAndSimpleReset, navigateAndReset } from '@/Navigators/Root'

import { store } from '@/Store'

export default () => {
  const state = store.getState()
  // Check auth status
  const isAuthenticated = state.user.item.hasOwnProperty('id')
  const deviceRegistered = state.device.item.hasOwnProperty('id')
  const healthFacilityAssociated =
    state.healthFacility.item.hasOwnProperty('id')
  const clinicianSelected = state.healthFacility.clinician.hasOwnProperty('id')
  let route = {}

  // Check whether the right permissions have been granted
  // If so, navigate to the main navigator and reset
  // If not, redirect to the access denied page
  try {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]).then(res => {
      if (Object.values(res).every(result => result === 'granted')) {
        if (!isAuthenticated || !deviceRegistered) {
          route = 'Login'
        } else if (!healthFacilityAssociated) {
          route = 'Synchronization'
        } else if (!clinicianSelected) {
          route = 'ClinicianSelection'
        } else {
          route = 'Pin'
        }

        navigateAndReset([{ name: 'Auth', params: { screen: route } }])
      } else if (
        Object.values(res).some(
          result => result === 'never_ask_again' || result === 'denied',
        )
      ) {
        navigateAndSimpleReset('PermissionsRequired')
      }
    })
  } catch (err) {
    console.warn(err)
  }
}
