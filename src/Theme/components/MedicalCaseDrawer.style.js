import { StyleSheet } from 'react-native'
import { hp } from '@/Theme/Responsive'

export default function (props) {
  const { Fonts, Gutters, Layout, Colors } = props

  return StyleSheet.create({
    wrapper: {
      ...Layout.fill,
      backgroundColor: Colors.mcDrawerNotDone,
    },
    header: {
      backgroundColor: Colors.darkGrey,
      flexBasis: hp(13),
      ...Layout.center,
    },
    textHeader: {
      color: Colors.white,
      ...Fonts.textRegular,
      ...Fonts.textUppercase,
    },
    textPatient: {
      color: Colors.white,
      ...Fonts.textRegular,
      ...Fonts.textBold,
    },
    textMonth: {
      color: Colors.white,
      ...Layout.smallLPadding,
      ...Fonts.textSmall,
      ...Gutters.regularHPadding,
    },
    itemWrapper: (open, status) => ({
      backgroundColor:
        status === 'notDone' ? Colors.mcDrawerNotDone : Colors.whiteToSecondary,
      ...(open ? Gutters.regularBPadding : null),
    }),
    stage: (open, status) => ({
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      ...Gutters.smallHPadding,
      ...Gutters.smallVPadding,
      backgroundColor:
        status === 'current'
          ? Colors.primary
          : status === 'notDone'
          ? Colors.mcDrawerNotDone
          : Colors.whiteToSecondary,
      borderColor: Colors.grey,
      borderTopWidth: 1,
      borderBottomWidth: open ? 1 : 0,
    }),
    stageText: status => ({
      ...Gutters.smallLMargin,
      ...Fonts.textUppercase,
      ...Fonts.textLeft,
      ...Layout.fill,
      ...Fonts.textBold,
      color:
        status === 'current'
          ? Colors.secondary
          : status === 'notDone'
          ? Colors.grey
          : Colors.primary,
    }),
    mainIcon: status => ({
      color:
        status === 'current'
          ? Colors.secondary
          : status === 'notDone'
          ? Colors.grey
          : Colors.primary,
    }),
    checkedIcon: status => ({
      color: status === 'done' ? Colors.primary : Colors.transparent,
    }),
    stepsWrapper: {
      ...Gutters.smallHPadding,
    },
    dotWrapper: {
      ...Gutters.smallHMargin,
      ...Layout.center,
    },
    stepText: status => ({
      ...Fonts.textTiny,
      ...Gutters.smallLMargin,
      color: status === 'notDone' ? Colors.grey : Colors.primary,
    }),
  })
}
