/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useNavigation, useNavigationState } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Round = ({ parentStatus, step, stepIndex }) => {
  const navigation = useNavigation()
  const [active, setActive] = useState(false)
  const {
    Components: { sideBar },
  } = useTheme()
  const currentStep = useNavigationState(
    state => state.routes[state.index].state?.index,
  )

  useEffect(() => {
    if (parentStatus === 'done') {
      setActive(true)
    } else if (parentStatus === 'notDone') {
      setActive(false)
    } else if (stepIndex <= currentStep || stepIndex === 0) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [parentStatus, currentStep, stepIndex])

  /**
   * Will navigate to the related step
   * TODO handle When we move to another stage
   */
  const handlePress = () => {
    navigation.navigate(step.label)
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={[
          sideBar.circle,
          parentStatus === 'notDone' && sideBar.circleNotDone,
        ]}
      >
        {active && <View style={sideBar.circleInner} />}
      </View>
    </TouchableOpacity>
  )
}
export default Round
