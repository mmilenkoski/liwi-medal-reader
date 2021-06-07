/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import format from 'date-fns/format'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const ListItem = ({ item }) => {
  // Theme and style elements deconstruction
  const navigation = useNavigation()
  const {
    Components: { patientListItem },
    Layout,
    Gutters,
    Fonts,
    FontSize,
  } = useTheme()

  return (
    <TouchableOpacity
      style={patientListItem.wrapper}
      onPress={() =>
        navigation.navigate('PatientProfile', {
          id: item.id,
          title: `${item.first_name} ${item.last_name} ${format(
            item.updatedAt,
            'dd.MM.yyyy',
          )}`,
        })
      }
    >
      <View style={patientListItem.container}>
        <View style={patientListItem.titleWrapper}>
          <Text
            style={patientListItem.title}
          >{`${item.first_name} ${item.last_name}`}</Text>
          <Text>{format(item.birth_date, 'dd.MM.yyyy')}</Text>
        </View>
        <View style={patientListItem.dateWrapper}>
          <Text style={Fonts.textCenter}>
            {format(item.updatedAt, 'dd.MM.yyyy')}
          </Text>
        </View>
        <View style={patientListItem.statusWrapper}>
          <Text style={patientListItem.statusTitle}>1st assessment</Text>
          <View style={Layout.row}>
            <Icon
              name="registration"
              size={FontSize.large}
              style={patientListItem.icon(false)}
            />
            <Icon
              name="assessment"
              size={FontSize.large}
              style={patientListItem.icon(true)}
            />
            <Icon
              name="consultation"
              size={FontSize.large}
              style={patientListItem.icon(false)}
            />
            <Icon
              name="tests"
              size={FontSize.large}
              style={patientListItem.icon(false)}
            />
            <Icon
              name="diagnosis"
              size={FontSize.large}
              style={patientListItem.icon(false)}
            />
          </View>
        </View>
        <View style={[Gutters.regularLMargin, Layout.column]}>
          <Icon name="right-arrow" size={25} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ListItem
