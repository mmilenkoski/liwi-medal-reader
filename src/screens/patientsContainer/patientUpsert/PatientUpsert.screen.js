// @flow

import * as React from 'react';
import { NavigationActions, NavigationScreenProps, StackActions } from 'react-navigation';
import { ScrollView } from 'react-native';
import { Button, Col, Text, View } from 'native-base';
import * as _ from 'lodash';
import NavigationService from '../../../engine/navigation/Navigation.service';
import CustomInput from '../../../components/InputContainer/CustomInput/CustomInput';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';
import { LiwiTitle2 } from '../../../template/layout';
import CustomSwitchButton from '../../../components/InputContainer/CustomSwitchButton';

import { styles } from './PatientUpsert.style';
import { getItemFromArray, getItems } from '../../../engine/api/LocalStorage';
import LiwiLoader from '../../../utils/LiwiLoader';
import { stage } from '../../../../frontend_service/constants';
import Questions from '../../../components/QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};
type State = {};

export default class PatientUpsert extends React.Component<Props, State> {
  state = {
    errors: {},
    patient: null,
    loading: true,
    algorithmReady: false,
  };

  initializeComponent = async () => {
    const { navigation, setMedicalCase, medicalCase } = this.props;
    let patient = {};
    const patientId = navigation.getParam('idPatient');
    const newMedicalCase = navigation.getParam('newMedicalCase'); // boolean
    const algorithms = await getItems('algorithms');

    if (patientId === null && newMedicalCase === true) {
      patient = new PatientModel();
    } else if (patientId !== null && newMedicalCase === true) {
      patient = await this.getPatient();
    } else if (newMedicalCase === false) {
      patient = new PatientModel(medicalCase.patient);
    }

    if (algorithms.length === 0) {
      this.setState({ patient });
    } else {
      // Generate medical case
      let generatedMedicalCase;
      if (newMedicalCase) {
        generatedMedicalCase = await this.generateMedicalCase();
        generatedMedicalCase.isNewCase = true;
        await setMedicalCase({
          ...generatedMedicalCase,
          patient: { ...patient, medicalCases: [] }, // Force
        });
      }

      this.setState({
        patient,
        algorithmReady: true,
        loading: false,
      });
    }
  };

  async componentDidMount() {
    await this.initializeComponent();
  }

  /**
   * Get patient with id in navigation props
   */
  async getPatient() {
    const { navigation } = this.props;
    const id = navigation.getParam('idPatient');
    let patient = await getItemFromArray('patients', 'id', id);

    patient = new PatientModel(patient);

    return patient;
  }

  /**
   * Save patient and redirect to parameters
   * @params [String] route
   */
  save = async (newRoute) => {
    await this.setState({ loading: true });
    const { navigation } = this.props;
    const isSaved = await this.savePatient();

    if (isSaved) {
      const currentRoute = NavigationService.getCurrentRoute();
      // Replace the nextRoute navigation at the current index
      navigation.dispatch(
        StackActions.replace({
          index: currentRoute.index,
          newKey: newRoute,
          routeName: newRoute,
          params: {
            initialPage: 0,
          },
          actions: [
            NavigationActions.navigate({
              routeName: newRoute,
            }),
          ],
        })
      );

      await this.setState({ loading: false });
    }
  };

  /**
   * Update state value of patient
   * @params [String] key [String] value
   */
  updatePatientValue = async (key, value) => {
    const { patient } = this.state;
    const { updatePatient } = this.props;
    updatePatient(key, value);
    patient[key] = value;
    await this.setState({ patient });
  };

  /**
   *  Update patient value in storage and redirect to patient profile
   */
  updatePatient = async () => {
    await this.setState({ loading: true });
    const { navigation } = this.props;
    const {
      patient: { id },
    } = this.state;
    await this.savePatient();
    navigation.dispatch(NavigationActions.back('patientProfile', { id }));
    await this.setState({ loading: false });
  };

  /**
   * Generate medical case for current patient
   * @params [Object] patient
   * @return [Object] medical case
   */
  generateMedicalCase = async () => {
    const instanceMedicalCase = new MedicalCaseModel();
    await instanceMedicalCase.create();
    return instanceMedicalCase;
  };

  /**
   * Set patient and medical case in localStorage
   */
  savePatient = async () => {
    const { patient } = this.state;
    const { updateMedicalCaseProperty, medicalCase } = this.props;
    const errors = await patient.validate();

    // Create patient if there are no errors
    if (_.isEmpty(errors)) {
      medicalCase.isNewCase = 'false'; // Workaround because redux persist is buggy with boolean
      updateMedicalCaseProperty('isNewCase', false); // Workauround because redux persist is buggy with boolean
      patient.medicalCases.push(medicalCase);
      await patient.save();
      return true;
    }
    this.setState({ errors });
    return false;
  };

  render() {
    const { updatePatientValue, save } = this;
    const { patient, errors, loading, algorithmReady } = this.state;

    const {
      app: { t },
      medicalCase,
      updateMetaData,
    } = this.props;

    let extraQuestions = [];
    if (medicalCase.nodes !== undefined) {
      // Get nodes to display in registration stage
      extraQuestions = medicalCase.nodes?.filterBy(
        [
          {
            by: 'stage',
            operator: 'equal',
            value: stage.registration,
          },
        ],
        'OR',
        'array',
        false
      );
    }

    let hasNoError = false;

    if (patient !== null) {
      hasNoError = !_.isEmpty(patient?.validate());
    }
    if (medicalCase.nodes !== undefined && medicalCase.metaData.patientupsert.custom.length === 0 && extraQuestions.length !== 0) {
      updateMetaData(
        'patientupsert',
        'custom',
        extraQuestions.map(({ id }) => id)
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always" testID="PatientUpsertScreen">
        <LiwiTitle2 noBorder>{t('patient_upsert:title')}</LiwiTitle2>
        {loading ? (
          <LiwiLoader />
        ) : (
          <React.Fragment>
            <View>
              <Col>
                <CustomInput
                  init={patient.firstname}
                  label={t('patient:first_name')}
                  change={updatePatientValue}
                  index="firstname"
                  iconName="user"
                  iconType="AntDesign"
                  error={errors.firstname}
                  autoCapitalize="sentences"
                />
                <CustomInput
                  init={patient.lastname}
                  label={t('patient:last_name')}
                  change={updatePatientValue}
                  index="lastname"
                  iconName="user"
                  iconType="AntDesign"
                  error={errors.lastname}
                  autoCapitalize="sentences"
                />
              </Col>
              <Col>
                <CustomSwitchButton
                  init={patient.gender}
                  label={t('patient:gender')}
                  change={updatePatientValue}
                  index="gender"
                  label1={t('patient:male')}
                  label2={t('patient:female')}
                  value1="male"
                  value2="female"
                  iconName="human-male-female"
                  iconType="MaterialCommunityIcons"
                  error={errors.gender}
                />
              </Col>
            </View>
            <Questions questions={extraQuestions} />
            <View bottom-view>
              {algorithmReady ? (
                !loading ? (
                  <View columns>
                    <Button light split onPress={() => save('PatientList')} disabled={hasNoError}>
                      <Text>{t('patient_upsert:save_and_wait')}</Text>
                    </Button>
                    <Button success split onPress={() => save('Triage')} disabled={hasNoError}>
                      <Text>{t('patient_upsert:save_and_case')}</Text>
                    </Button>
                  </View>
                ) : (
                  <LiwiLoader />
                )
              ) : (
                <View columns>
                  <Text>{t('work_case:no_algorithm')}</Text>
                </View>
              )}
            </View>
          </React.Fragment>
        )}
      </ScrollView>
    );
  }
}
