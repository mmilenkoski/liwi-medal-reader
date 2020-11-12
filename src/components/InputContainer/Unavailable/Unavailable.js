// @flow

import * as React from 'react';
import { CheckBox } from 'native-base';
import { liwiColors } from '../../../utils/constants';
import { styles } from './Unavailable.style';

export default class Unavailable extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { question } = this.props;

    return question.answer !== nextProps.question.answer;
  }

  onPress = () => {
    const {
      app: { algorithm },
      setAnswerUnavailable,
      question,
      unavailableAnswer,
    } = this.props;

    if (question.answer === null || question.answer !== unavailableAnswer.id) {
      setAnswerUnavailable(algorithm, question.id, unavailableAnswer.id);
    } else {
      // reset to null the checkbox
      setAnswerUnavailable(algorithm, question.id, null);
    }
  };

  render() {
    const { question, unavailableAnswer } = this.props;
    return <CheckBox style={styles.unavailableBox} onPress={this.onPress} color={liwiColors.redColor} checked={question.answer === unavailableAnswer.id} />;
  }
}
