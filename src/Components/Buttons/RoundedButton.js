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

const RoundedButton = props => {
  // Props deconstruction
  const { content, disabled, icon } = props

  // Theme and style elements deconstruction
  const {
    Components: { roundedButton },
    Colors,
    Gutters,
  } = useTheme()

  /**
   * Handles the press action on the TouchableOpacity
   */
  const handlePress = () => {
    console.log('button pressed')
  }

  return (
    <View style={roundedButton.wrapper}>
      <TouchableOpacity
        onPress={() => handlePress()}
        style={roundedButton.base(disabled)}
        disabled={disabled}
      >
        <View style={roundedButton.content}>
          {icon && (
            <View style={Gutters.regularRMargin}>
              <Icon name={icon} color={Colors.secondary} />
            </View>
          )}
          <Text style={roundedButton.baseText}>{content}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default RoundedButton
