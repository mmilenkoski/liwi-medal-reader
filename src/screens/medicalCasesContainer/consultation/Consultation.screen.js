// @flow

import React, { Suspense } from 'react';
import { View } from 'native-base';

import { NavigationScreenProps } from 'react-navigation';
import find from 'lodash/find';
import { styles } from '../diagnosticsStrategyContainer/diagnosticsStrategy/DiagnosticsStrategy.style';

import LiwiLoader from '../../../utils/LiwiLoader';
import { categories } from '../../../../frontend_service/constants';

const Stepper = React.lazy(() => import('../../../components/Stepper'));

const QuestionsPerSystem = React.lazy(() => import('../../../components/Consultation/QuestionsPerSystem'));

type Props = NavigationScreenProps & {};
type State = {};

export default class Consultation extends React.Component<Props, State> {
  componentWillMount() {
    const {
      navigation,
      medicalCase: { patient, nodes },
    } = this.props;

    const age = find(nodes, { reference: '1', category: 'demographic' });

    let stringAge;
    if (age === undefined) {
      stringAge = 'The node age is not find';
    } else {
      stringAge = age.value === null ? 'Age is not defined' : age.value + ' months';
    }

    navigation.setParams({
      title: 'Consultation  ',
      headerRight: `${patient.firstname} ${patient.lastname} | ${stringAge}`,
    });
  }

  render() {
    const {
      app: { t },
      focus,
      navigation,
      medicalCase,
      updateMetaData,
    } = this.props;

    let selectedPage = navigation.getParam('initialPage');

    // Filter questions medical history
    let medical_history = medicalCase.nodes.filterBy(
      [
        {
          by: 'category',
          operator: 'equal',
          value: categories.symptom,
        },
        {
          by: 'category',
          operator: 'equal',
          value: categories.exposure,
        },
        {
          by: 'category',
          operator: 'equal',
          value: categories.vitalSignTriage,
        },
      ],
      'OR',
      'array',
      false
    );

    // Filter questions physical exam
    let physical_exam = medicalCase.nodes.filterBy(
      [
        {
          by: 'category',
          operator: 'equal',
          value: categories.physicalExam,
        },
        {
          by: 'category',
          operator: 'equal',
          value: categories.other,
        },
      ],
      'OR',
      'array',
      false
    );

    if (medicalCase.metaData.consultation.medicalHistory.length === 0 && medical_history.length !== 0) {
      updateMetaData('consultation', 'medicalHistory', medical_history.map(({ id }) => id));
    }

    if (medicalCase.metaData.consultation.physicalExam.length === 0 && physical_exam.length !== 0) {
      updateMetaData('consultation', 'physicalExam', physical_exam.map(({ id }) => id));
    }

    return (
      <Suspense fallback={null}>
        <Stepper
          ref={(ref: any) => {
            this.stepper = ref;
          }}
          initialPage={selectedPage}
          validation={false}
          showTopStepper
          showBottomStepper
          onPageSelected={(e) => {
            navigation.setParams({
              initialPage: e,
            });
          }}
          icons={[{ name: 'comment-medical', type: 'FontAwesome5' }, { name: 'ios-body', type: 'Ionicons' }]}
          steps={[t('consultation:medical_history'), t('consultation:physical_exam')]}
          backButtonTitle={t('medical_case:back')}
          nextButtonTitle={t('medical_case:next')}
          nextStage="Tests"
          nextStageString={t('medical_case:test')}
        >
          <View style={styles.pad}>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <QuestionsPerSystem questions={medical_history} selectedPage={selectedPage} pageIndex={0} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <View style={styles.pad}>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <QuestionsPerSystem questions={physical_exam} selectedPage={selectedPage} pageIndex={1} />
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
