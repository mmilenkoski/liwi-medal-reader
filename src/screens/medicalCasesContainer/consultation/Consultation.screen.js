// @flow

import React, { Suspense } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'native-base';

import LiwiLoader from '../../../utils/LiwiLoader';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { questionsMedicalHistory, questionsPhysicalExam } from '../../../../frontend_service/algorithm/questionsStage.algo';
import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';

const Stepper = React.lazy(() => import('../../../components/Stepper'));
const QuestionsPerSystem = React.lazy(() => import('../../../components/Consultation/QuestionsPerSystem'));

type Props = NavigationScreenProps & {};
type State = {};

export default class Consultation extends React.Component<Props, State> {
  componentDidMount() {
    NavigationService.setParamsAge('Consultation');
  }

  render() {
    const {
      app: { t },
      focus,
      navigation,
    } = this.props;

    const selectedPage = navigation.getParam('initialPage');

    return (
      <Suspense fallback={<LiwiLoader />}>
        <Stepper
          initialPage={selectedPage}
          validation={false}
          showTopStepper
          showBottomStepper
          onPageSelected={(e) => {
            navigation.setParams({
              initialPage: e,
            });
          }}
          icons={[
            { name: 'comment-medical', type: 'FontAwesome5' },
            { name: 'male', type: 'FontAwesome5' },
          ]}
          steps={[t('consultation:medical_history'), t('consultation:physical_exam')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="Tests"
          nextStageString={t('medical_case:test')}
        >
          <View style={styles.pad}>
            {focus === 'didFocus' || focus === 'willFocus' ? (
              <Suspense fallback={<LiwiLoader />}>
                <QuestionsPerSystem questions={questionsMedicalHistory()} selectedPage={selectedPage} pageIndex={0} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.pad}>
            {focus === 'didFocus' || focus === 'willFocus' ? (
              <Suspense fallback={<LiwiLoader />}>
                <QuestionsPerSystem questions={questionsPhysicalExam()} selectedPage={selectedPage} pageIndex={1} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
        </Stepper>
      </Suspense>
    );
  }
}
