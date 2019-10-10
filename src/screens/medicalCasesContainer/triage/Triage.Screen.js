// @flow

import React, { Suspense } from 'react';
import { Content, View } from 'native-base';

import { NavigationScreenProps } from 'react-navigation';
import { styles } from '../DiagnosticsStrategyContainer/DiagnosticsStrategy/DiagnosticsStrategy.style';
import { categories } from '../../../../frontend_service/constants';
import LiwiLoader from '../../../utils/LiwiLoader';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';

const Boolean = React.lazy(() =>
  import('../../../components/QuestionsContainer/DisplaysContainer/Boolean')
);
const Questions = React.lazy(() =>
  import('../../../components/QuestionsContainer/Questions')
);
const Stepper = React.lazy(() => import('../../../components/Stepper'));

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

export default class Triage extends React.Component<Props, State> {
  componentWillMount() {
    const {
      navigation,
      medicalCase: { patient },
    } = this.props;
    navigation.setParams({
      title: 'Triage : ' + patient.lastname + ' ' + patient.lastname,
    });
  }

  state = {
    widthView: 0,
  };

  render() {
    const {
      app: { t },
      medicalCase,
      focus,
      navigation,
    } = this.props;

    const initialPage = navigation.getParam('initialPage');

    let firstLookAssessement = [];

    const ordersFirstLookAssessment =
      medicalCase.triage.orders[categories.firstLookAssessment];

    ordersFirstLookAssessment.map((order) => {
      firstLookAssessement.push(medicalCase.nodes[order]);
    });

    const { widthView } = this.state;

    const orders = medicalCase.triage.orders[categories.chiefComplaint];
    let chiefComplaint = [];

    orders.map((order) => {
      chiefComplaint.push(medicalCase.nodes[order]);
    });

    let vitalSigns = [];
    const orderedQuestions = medicalCase.triage.orders[categories.vitalSign];

    orderedQuestions.map((orderedQuestion) => {
      let question = medicalCase.nodes[orderedQuestion];
      if (question.isDisplayedInTriage(medicalCase)) {
        vitalSigns.push(question);
      }
    });

    return (
      <Suspense fallback={null}>
        <Stepper
          ref={(ref: any) => {
            this.stepper = ref;
          }}
          validation={false}
          showTopStepper
          initial
          initialPage={initialPage}
          showBottomStepper
          icons={[
            { name: 'eye-plus', type: 'MaterialCommunityIcons' },
            { name: 'heart-broken', type: 'FontAwesome5' },
            { name: 'healing', type: 'MaterialIcons' },
          ]}
          steps={[t('triage:assessment'), t('triage:chief'), t('triage:vital')]}
          backButtonTitle="BACK"
          nextButtonTitle="NEXT"
          nextStage="Consultation"
          nextStageString="CONSULTATION"
        >
          <View style={styles.pad}>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <Questions questions={firstLookAssessement} />
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </View>
          <Content>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <View
                  flex-container-fluid
                  onLayout={async (p) => {
                    let w = await p.nativeEvent;
                    this.setState({ widthView: w.layout.width });
                  }}
                >
                  {chiefComplaint.map((question, i) => (
                    <Boolean
                      key={question.id + 'chief_boolean'}
                      widthView={widthView}
                      question={question}
                      index={i}
                    />
                  ))}
                </View>
              </Suspense>
            ) : (
              <LiwiLoader />
            )}
          </Content>
          <View>
            {focus === 'didFocus' ? (
              <Suspense fallback={null}>
                <Questions questions={vitalSigns} />
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
