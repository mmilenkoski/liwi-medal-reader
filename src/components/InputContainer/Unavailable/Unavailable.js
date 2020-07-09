// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { CheckBox } from 'native-base';
import { liwiColors } from '../../../utils/constants';
import { styles } from './Unavailable.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class Unavailable extends React.Component<Props, State> {
  state = {};

  onPress = () => {
    const { setAnswerUnavailable, question, unavailableAnswer } = this.props;

    if (question.answer === null || question.answer !== unavailableAnswer.id) {
      setAnswerUnavailable(question.id, unavailableAnswer.id);
    } else {
      // reset to null the checkbox
      setAnswerUnavailable(question.id, null);
    }
  };

  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { question } = this.props;

    return question.answer !== nextProps.question.answer;
  }

  render() {
    const { question, unavailableAnswer } = this.props;
    return <CheckBox style={styles.unavailableBox} onPress={this.onPress} color={liwiColors.redColor} checked={question.answer === unavailableAnswer.id} />;
  }
}
