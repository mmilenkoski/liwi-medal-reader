/**
 * The external imports
 */
import {
  buildAsyncState,
  buildAsyncActions,
  buildAsyncReducers,
} from '@thecodingmachine/redux-toolkit-wrapper'
import { DocumentDirectoryPath, exists, readFile } from 'react-native-fs'

/**
 * The internal imports
 */
import i18n from '@/Translations'
import DefaultTheme from '@/Store/Theme/DefaultTheme'
import ChangeEmergencyContent from '@/Store/Emergency/ChangeEmergencyContent'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import { store } from '@/Store'
import { RedirectService } from '@/Services/Device'
import FetchOneHealthFacility from '@/Store/HealthFacility/FetchOne'

export default {
  initialState: buildAsyncState(),
  action: buildAsyncActions('startup/init', async (args, { dispatch }) => {
    const state = store.getState()

    // Set default language
    const appLanguage = state.system.appLanguage
    i18n.changeLanguage(appLanguage)

    // Set default theme
    await dispatch(DefaultTheme.action({ theme: 'default', darkMode: null }))

    // Set emergency content
    const targetPath = `${DocumentDirectoryPath}/emergency_content.html`
    const fileExist = await exists(targetPath)
    if (fileExist) {
      const emergencyContent = await readFile(targetPath)
      await dispatch(
        ChangeEmergencyContent.action({
          newContent: emergencyContent,
        }),
      )
    }

    // Set algorithm
    const algorithmTargetPath = `${DocumentDirectoryPath}/version_${state.system.versionId}.json`
    const algorithmFileExist = await exists(algorithmTargetPath)

    if (algorithmFileExist) {
      const algorithm = await readFile(algorithmTargetPath)
      await dispatch(
        LoadAlgorithm.action({
          newAlgorithm: JSON.parse(algorithm),
        }),
      )
    }

    // Get health facility update
    if (state.healthFacility.item.id) {
      await dispatch(FetchOneHealthFacility.action({}))
    }

    RedirectService()
  }),
  reducers: buildAsyncReducers({ itemKey: null }), // We do not want to modify some item by default
}
