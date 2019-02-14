import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  view: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#8B8393',
  },
  textWithoutIcon: { marginTop: 5 },
  textWithIcon: { marginTop: 5, marginLeft: 20 },
  input: {},
});
