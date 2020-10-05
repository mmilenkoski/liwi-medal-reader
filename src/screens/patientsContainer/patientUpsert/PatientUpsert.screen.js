// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Col, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import uuid from 'react-native-uuid';
import NavigationService from '../../../engine/navigation/Navigation.service';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';
import { LiwiTitle2 } from '../../../template/layout';
import Stepper from '../../../components/Stepper';

import { getItem } from '../../../engine/api/LocalStorage';
import { styles } from './PatientUpsert.style';
import { stages } from '../../../../frontend_service/constants';
import LiwiLoader from '../../../utils/LiwiLoader';
import Questions from '../../../components/QuestionsContainer/Questions';
import CustomInput from '../../../components/InputContainer/CustomInput/index';
import ConsentImage from '../../../components/InputContainer/ConsentImage/index';
import { nodeFilterBy } from '../../../../frontend_service/engine/models/Node.model';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientUpsert extends React.Component<Props, State> {
  state = {
    errors: {},
    patient: null,
    loading: true,
  };

  constructor(props) {
    super(props);
    this.init();
  }

  async init() {
    const {
      navigation,
      setMedicalCase,
      setAnswer,
      updateMedicalCaseProperty,
      app: { database, algorithm },
    } = this.props;

    let patient = {};

    const patientId = navigation.getParam('idPatient');
    const session = await getItem('session');
    const newMedicalCase = navigation.getParam('newMedicalCase'); // boolean
    const otherFacility = navigation.getParam('otherFacility'); // Object
    let facility = navigation.getParam('facility'); // Object

    if (patientId === null) {
      if (facility === undefined) {
        facility = { uid: uuid.v4(), group_id: session.facility.id, study_id: 'Test' };
      }
      patient = new PatientModel({ otherFacility, facility });
    } else {
      patient = await database.findBy('Patient', patientId);
    }
    if (newMedicalCase) {
      const generatedMedicalCase = await new MedicalCaseModel({}, algorithm);
      // If the patient already exists we gonna retrieve it's patient Value
      await setMedicalCase({
        ...generatedMedicalCase,
        patient: { ...patient, medicalCases: [] }, // Force
      });
      if (patientId !== null) {
        patient.patientValues.forEach((patientValue) => {
          setAnswer(algorithm, patientValue.node_id, patientValue.value);
        });
      }
    }

    NavigationService.setParamsAge(algorithm, 'Patient');
    updateMedicalCaseProperty('patient', { ...patient, medicalCases: [] });

    this.setState({
      patient,
      loading: false,
    });
  }

  /**
   * Calculate age in year of the patient
   */
  renderEligibilityMessage = () => {
    const { medicalCase } = this.props;

    if (!medicalCase.isEligible) {
      return (
        <View style={styles.warning}>
          <Text size-auto>{medicalCase.config.age_limit_message}</Text>
        </View>
      );
    }
  };

  /**
   * Update state value of patient
   * @params [String] key [String] value
   */
  updatePatientValue = async (key, value) => {
    const { updatePatient } = this.props;
    updatePatient(key, value);
  };

  renderIdentifierData = () => {
    const { patient } = this.state;
    const { t } = this.props.app;

    if (patient === null) {
      return null;
    }

    const { other_uid, other_study_id, other_group_id } = patient;

    return (
      <View>
        <Text customSubTitle>{t('patient_upsert:facility')}</Text>
        <View w50 style={styles.containerText}>
          <Text style={styles.identifierText}>{t('patient_upsert:uid')}</Text>
          <CustomInput
            disabled
            placeholder=""
            condensed
            style={[styles.identifierText, styles.identifierTextDisabled]}
            init={patient.uid}
            change={this.updatePatientValue}
            index="uid"
            autoCapitalize="sentences"
          />
        </View>
        <View w50 style={styles.containerText}>
          <Text style={styles.identifierText}>{t('patient_upsert:study_id')}</Text>
          <CustomInput placeholder="" condensed style={styles.identifierText} init={patient.study_id} change={this.updatePatientValue} index="study_id" autoCapitalize="sentences" />
        </View>

        <View w50 style={styles.containerText}>
          <Text style={styles.identifierText}>{t('patient_upsert:group_id')}</Text>
          <CustomInput
            disabled
            placeholder="..."
            keyboardType="number-pad"
            condensed
            style={[styles.identifierText, styles.identifierTextDisabled]}
            init={patient.group_id}
            change={this.updatePatientValue}
            index="group_id"
            autoCapitalize="sentences"
          />
        </View>

        {patient.wasInOtherFacility() && (
          <>
            <View w50 style={styles.containerText}>
              <Text style={styles.identifierText}>{t('patient_upsert:other_uid')}</Text>
              <Text style={styles.identifierText} right>
                {other_uid}
              </Text>
            </View>
            <View w50 style={styles.containerText}>
              <Text style={styles.identifierText}>{t('patient_upsert:other_study_id')}</Text>
              <Text style={styles.identifierText} right>
                {other_study_id}
              </Text>
            </View>
            <View w50 style={styles.containerText}>
              <Text style={styles.identifierText}>{t('patient_upsert:other_group_id')}</Text>
              <Text style={styles.identifierText} right>
                {other_group_id}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };

  render() {
    const { patient, errors, loading } = this.state;
    const {
      app: { t, algorithm },
      medicalCase,
      updateMetaData,
      navigation,
    } = this.props;

    if (loading) {
      return <LiwiLoader />;
    }

    // Get nodes to display in registration stage
    const extraQuestions = nodeFilterBy(
      medicalCase,
      algorithm,
      [
        {
          by: 'stage',
          operator: 'equal',
          value: stages.registration,
        },
      ],
      'OR',
      'array',
      false
    );

    if (medicalCase.metaData.patientupsert.custom.length === 0 && extraQuestions.length !== 0) {
      updateMetaData(
        'patientupsert',
        'custom',
        extraQuestions.map(({ id }) => id)
      );
    }

    return (
      <Stepper
        validation={false}
        onPageSelected={(e) => {
          navigation.setParams({
            initialPage: e,
          });
        }}
        initialPage={0}
        showBottomStepper
        icons={[{ name: 'test-tube', type: 'MaterialCommunityIcons' }]}
        steps={[t('medical_case:triage')]}
        backButtonTitle={t('medical_case:back')}
        nextButtonTitle={t('medical_case:next')}
        nextStage="Triage"
        nextStageString={t('navigation:triage')}
      >
        {[
          <ScrollView key="PatientUpsertScreen" contentContainerStyle={styles.container} testID="PatientUpsertScreen">
            <LiwiTitle2 noBorder>{t('patient_upsert:title')}</LiwiTitle2>
            {this.renderEligibilityMessage()}
            <View>
              <Col>
                {this.renderIdentifierData()}
                {patient.wasInOtherFacility() && (
                  <CustomInput
                    init={patient.reason}
                    label={t('patient:reason')}
                    change={this.updatePatientValue}
                    index="reason"
                    iconName="sign-out"
                    iconType="FontAwesome"
                    error={errors.reason}
                    autoCapitalize="sentences"
                  />
                )}
              </Col>
            </View>
            <ConsentImage newPatient={patient.id === null} />
            <Text customSubTitle>{t('patient_upsert:questions')}</Text>
            <Questions questions={extraQuestions} />
          </ScrollView>,
        ]}
      </Stepper>
    );
  }
}
