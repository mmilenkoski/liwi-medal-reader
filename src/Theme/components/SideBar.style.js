import { StyleSheet } from 'react-native'
import { Color } from '../../../../../.cache/typescript/4.2/node_modules/chalk/index'

export default function (props) {
  const { Colors, Layout, FontSize } = props
  return StyleSheet.create({
    circle: {
      width: 35,
      height: 35,
      borderRadius: 35 / 2,
      backgroundColor: Colors.white,
      borderColor: Colors.black,
      borderWidth: 3,
      marginBottom: 10,
    },
    circleNotDone: { borderColor: Colors.grey },
    circleInner: {
      width: 23,
      height: 23,
      borderRadius: 23 / 2,
      backgroundColor: Colors.black,
      marginTop: 3,
      marginLeft: 3,
    },
    barItemCurrent: {
      backgroundColor: Colors.black,
      color: Colors.white,
      display: 'flex',
      alignItems: 'center',
      width: 60,
    },
    text: {
      textTransform: 'uppercase',
      overflow: 'visible',
      fontSize: FontSize.regular,
      fontWeight: 'bold',
      color: Colors.black,
      textAlign: 'center',
      padding: 0,
      marginTop: -10,
      transform: [{ rotateZ: '90deg' }],
    },
    textCurent: { color: Colors.white },
    textNotDone: { color: Colors.grey },
    rotatedTextWrapper: {
      paddingTop: 17,
      paddingBottom: 12,
      marginBottom: 7,
    },
    container: { display: 'flex', alignItems: 'center' },
    wrapper: {
      ...Layout.fullWidth,
      flexBasis: 60,
      backgroundColor: Colors.white,
      flexDirection: 'row',
    },
  })
}
