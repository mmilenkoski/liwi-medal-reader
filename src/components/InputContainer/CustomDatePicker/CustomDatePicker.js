// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { DatePicker, Form, Icon, Text } from 'native-base';
import moment from 'moment';
import { styles } from './CustomDatePicker.style';
import { ViewBlocColor } from '../../../template/layout';
import { liwiColors } from '../../../utils/constants';

type Props = NavigationScreenProps & {};
type State = {};

export default class CustomDatePicker extends React.Component<Props, State> {
  state = { value: '' };

  static defaultProps = { iconName: false, iconType: false };

  shouldComponentUpdate(
    nextProps: Readonly<P>,
    nextState: Readonly<S>
  ): boolean {
    return (
      this.state.value !== nextState.value || this.props.init !== nextProps.init || this.props.error !== nextProps.error
    );
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    if (nextProps.id !== this.props.id) {
      this.setState({ value: nextProps.init });
    }
  }

  componentWillMount(): void {
    this.setState({ value: this.props.init });
  }

  _handleChangeValue = (value) => {
    const {change, index} = this.props;

    this.setState({ value: new Date(value).toString() });
    change(index, moment(value).format('DD/MM/YYYY'));
  };

  render() {
    const { label, iconName, iconType, error } = this.props;
    const { value } = this.state;

    return (
      <Form style={styles.form}>
        <View style={styles.view}>
          {iconName && iconType ? (
            <Icon name={iconName} type={iconType} style={styles.icon} />
          ) : null}
          <Text
            style={
              iconName && iconType
                ? styles.textWithoutIcon
                : styles.textWithIcon
            }
          >
            {label}
          </Text>
          <Text error>{error}</Text>
        </View>
        <ViewBlocColor>
          <DatePicker
            defaultDate={moment(value).toDate()}
            minimumDate={new Date(1930, 1, 1)}
            maximumDate={new Date()}
            locale={'fr'}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={'fade'}
            androidMode={'default'}
            textStyle={{ color: liwiColors.blackColor, padding:20 }}
            placeHolderTextStyle={{ color: liwiColors.darkerGreyColor}}
            onDateChange={this._handleChangeValue}
            disabled={false}
          />
        </ViewBlocColor>
      </Form>
    );
  }
}
