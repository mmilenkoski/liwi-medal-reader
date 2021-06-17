import { StyleSheet } from 'react-native'

export default function (props) {
  const { Layout, Fonts, Colors, Gutters } = props

  return StyleSheet.create({
    header: {
      ...Fonts.textUppercase,
      ...Fonts.titleLarge,
      ...Fonts.textCenter,
    },
    errorMessage: {
      ...Fonts.textRegular,
      ...Fonts.textCenter,
      color: Colors.red,
    },
    switchOuterWrapper: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentCenter,
    },
    switchInnerWrapper: {
      ...Layout.alignItemsCenter,
    },
    switchLabel: {
      ...Fonts.textSmall,
      ...Gutters.regularLMargin,
      ...Fonts.textColorText,
    },
    themeToggleWrapper: {
      position: 'absolute',
      ...Layout.alignItemsCenter,
      ...Layout.justifyContentCenter,
      bottom: 0,
      left: 0,
      right: 0,
    },
  })
}
