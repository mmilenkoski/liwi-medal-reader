/**
 * The external imports
 */
import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { FontSize } from '@/Theme/Variables'

const SquareButton = ({
  label = null,
  filled,
  disabled,
  onPress,
  icon,
  big,
  iconAfter = false,
  bgColor = null,
  color = null,
  iconSize = FontSize.huge,
  align = null,
  fullWidth = true,
}) => {
  // Theme and style elements deconstruction
  const {
    Components: { squareButton },
    Colors,
    Layout,
  } = useTheme()

  // Constants definition
  const type = filled ? 'filled' : 'outlined'
  const iconColor =
    color !== null ? color : filled ? Colors.secondary : Colors.primary

  return (
    <View style={squareButton.wrapper(fullWidth)}>
      <TouchableOpacity
        onPress={() => onPress()}
        style={squareButton[type](disabled, bgColor, align, big)}
        disabled={disabled}
      >
        <View style={Layout.rowCenter}>
          {!iconAfter && icon && (
            <Icon
              name={icon}
              color={iconColor}
              style={squareButton.iconLeft(big)}
              size={iconSize}
            />
          )}
          {label !== null && (
            <View style={squareButton.textWrapper}>
              <Text style={squareButton[`${type}Text`](color)}>{label}</Text>
            </View>
          )}
          {iconAfter && icon && (
            <Icon
              name={icon}
              color={iconColor}
              style={squareButton.iconRight(big)}
              size={iconSize}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SquareButton
