// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { categories } from '../../../../frontend_service/constants';
import QuestionList from '../../../components/Triage/QuestionList';

type Props = NavigationScreenProps & {};
type State = {};

// eslint-disable-next-line react/prefer-stateless-function
export default class Tests extends React.Component<Props, State> {
  render() {
    const { medicalCase } = this.props;

    let assessmentTest = medicalCase.nodes.filterBy([
      { by: 'category', operator: 'equal', value: categories.assessment },
      { by: 'counter', operator: 'more', value: 0 },
    ]);

    return (
      <React.Fragment>
        <QuestionList questions={assessmentTest} />
      </React.Fragment>
    );
  }
}
