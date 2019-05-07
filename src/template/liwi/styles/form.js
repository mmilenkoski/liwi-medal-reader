import { screenWidth } from 'utils/constants';
import { liwiColors } from '../../../utils/constants';

export default {
  'NativeBase.Item': {},
  'NativeBase.Input': {
    '.login-input': {},
    '.string': {
      width: screenWidth * 0.8,
    },
    '.common': {
      color: liwiColors.whiteColor,
      paddingTop: 10,
      paddingLeft: 10,
    },
    '.question': {
      borderColor: liwiColors.greyColor,
      borderWidth: 1,
      width: '100%',
      flex: 1,
      margin: 0,
    },
  },
};
