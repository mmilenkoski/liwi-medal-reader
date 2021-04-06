/**
 * The external imports
 */
import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const RoundedButton = props => {
  const { content, disabled, icon } = props

  const { Common, Colors, Gutters } = useTheme()

  const handlePress = () => {
    console.log('button pressed')
  }

  return (
    <View style={Common.roundedButton.wrapper}>
      <TouchableOpacity
        onPress={() => handlePress()}
        style={Common.roundedButton.base(disabled)}
        disabled={disabled}
      >
        <View style={Common.roundedButton.content}>
          {icon && (
            <View style={Gutters.regularRMargin}>
              <Icon name={icon} size={18} color={Colors.white} />
            </View>
          )}
          <Text style={Common.roundedButton.baseText}>{content}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default RoundedButton
