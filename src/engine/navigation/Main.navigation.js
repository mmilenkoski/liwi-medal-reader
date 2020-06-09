import React from 'react';
import { Button, Icon, Text } from 'native-base';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';

import Algorithms from '../../screens/algorithmsContainer/Algorithms';
import Drawer from './drawer';
import MainScreen from '../../screens/main/Main.screen';
import PatientEdit from '../../screens/patientsContainer/patientEdit';
import PatientUpsert from '../../screens/patientsContainer/patientUpsert';
import PatientProfile from '../../screens/patientsContainer/patientProfile';
import PatientList from '../../screens/patientsContainer/patientList';
import Settings from '../../screens/settings';
import i18n from '../../utils/i18n';

import { liwiColors, screenWidth } from '../../utils/constants';
import { medicalCaseStatus } from '../../../frontend_service/constants';
import Summary from '../../screens/medicalCasesContainer/summary';
import MedicalCaseList from '../../screens/medicalCasesContainer/medicalCaseList';
import Tests from '../../screens/medicalCasesContainer/tests';
import DiagnosticsStrategy from '../../screens/medicalCasesContainer/diagnosticsStrategyContainer/diagnosticsStrategy';
import Triage from '../../screens/medicalCasesContainer/triage';
import Consultation from '../../screens/medicalCasesContainer/consultation';
import Emergency from '../../screens/emergency';

// We need to use i18n directly because we cant be connect to context
const Stack = createStackNavigator(
  {
    Algorithms: {
      screen: Algorithms,
      path: 'algorithms',
      params: {},
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:available_algorithms'),
        };
      },
    },
    Consultation: {
      screen: Consultation,
      path: 'consultation',
      params: {
        showMiniDrawer: true,
        dropDownMenu: 'Consultation',
        medicalCaseStatus: medicalCaseStatus.consultation.name,
        nextStage: medicalCaseStatus.waitingTests.name,
      },
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
    DiagnosticsStrategy: {
      screen: DiagnosticsStrategy,
      path: 'DiagnosticsStrategy',
      params: {
        showMiniDrawer: true,
        dropDownMenu: 'Final_diagnostic',
        medicalCaseStatus: medicalCaseStatus.finalDiagnostic.name,
        nextStage: medicalCaseStatus.close.name,
      },
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
    Emergency: {
      screen: Emergency,
      params: {},
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:emergency'),
        };
      },
    },
    Home: {
      screen: MainScreen,
      params: {},
      path: 'home',

      navigationOptions: ({ navigation }) => {
        return {
          title: i18n.t('navigation:home'),
          headerLeft: () => (
            <Button iconMenu iconLeft onPress={() => navigation.openDrawer()}>
              <Icon type="Entypo" name="menu" large />
            </Button>
          ),
          headerTitleContainerStyle: {
            marginLeft: 15,
          },
        };
      },
    },
    MedicalCaseList: {
      screen: MedicalCaseList,
      path: 'medicalCaseList',
      params: {},
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:medical_case_list'),
        };
      },
    },
    PatientEdit: {
      screen: PatientEdit,
      path: 'patientEdit',
      params: {},
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:patient_edit'),
        };
      },
    },
    PatientList: {
      screen: PatientList,
      path: 'patientList',
      params: {},
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:patient_list'),
        };
      },
    },
    PatientProfile: {
      screen: PatientProfile,
      path: 'patientProfile',
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:patient_profile'),
        };
      },
    },
    PatientUpsert: {
      screen: PatientUpsert,
      path: 'patient/',
      params: {
        showMiniDrawer: true,
      },
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:patient_upsert'),
        };
      },
    },
    Settings: {
      screen: Settings,
      path: 'settings',
      params: {},
      navigationOptions: () => {
        return {
          title: i18n.t('navigation:settings'),
        };
      },
    },
    Tests: {
      screen: Tests,
      path: 'tests',
      params: {
        showMiniDrawer: true,
        dropDownMenu: 'Tests',
        medicalCaseStatus: medicalCaseStatus.tests.name,
        nextStage: medicalCaseStatus.waitingDiagnostic.name,
      },
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
    Triage: {
      screen: Triage,
      path: 'triage',
      params: {
        showMiniDrawer: true,

        title: '',
        dropDownMenu: 'Triage',
        medicalCaseStatus: medicalCaseStatus.triage.name,
        nextStage: medicalCaseStatus.waitingConsultation.name,
      },
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.getParam('title'),
        };
      },
    },
  },
  {
    headerMode: 'float',
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: () => (
          <Button iconMenu onPress={() => navigation.openDrawer()}>
            <Icon type="Entypo" name="menu" large />
          </Button>
        ),
        headerRight: () => (
          <Text
            style={{
              marginRight: 50,
              fontSize: 20,
              fontWeight: '500',
              color: liwiColors.blackLightColor,
            }}
          >
            {navigation.getParam('headerRight')}
          </Text>
        ),
        headerStyle: {
          backgroundColor: '#E9E9E9',
        },
        headerTitleStyle: { color: liwiColors.blackColor },
        headerTitleContainerStyle: {
          marginLeft: 50,
        },
      };
    },
  }
);

const HomeWithModal = createStackNavigator(
  {
    Home: { screen: Stack },
    Summary: {
      screen: Summary,
      path: 'summary',
      params: {},
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const MainNavigation = () => {
  const drawerWidth = screenWidth / 2.2;
  return createDrawerNavigator(
    {
      RootDrawer: { screen: HomeWithModal },
    },
    {
      drawerContainerStyle: { width: drawerWidth + 500 },
      drawerWidth,
      overlayColor: 'rgba(38,38,38,0.8)',
      contentComponent: (props) => {
        return <Drawer {...props} drawerWidth={drawerWidth} isDrawer />;
      },
    }
  );
};

export default MainNavigation;
