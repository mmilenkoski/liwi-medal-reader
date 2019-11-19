// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Icon, Input, Item, List, ListItem, Picker, Text, View } from 'native-base';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import { NavigationScreenProps } from 'react-navigation';
import moment from 'moment';
import { styles } from './MedicalCaseList.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { getArray } from '../../../engine/api/LocalStorage';
import { medicalCaseStatus, routeDependingStatus } from '../../../../frontend_service/constants';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import LiwiLoader from '../../../utils/LiwiLoader';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

export default class MedicalCaseList extends React.Component<Props, State> {
  state = {
    medicalCases: [],
    orderedFilteredMedicalCases: [],
    searchTerm: '',
    loading: false,
    orderByName: 'asc',
    orderByStatus: null,
    orderBySurName: null,
    orderByUpdate: null,
    filterTerm: '',
    statuses: [
      medicalCaseStatus.waitingTriage.name,
      medicalCaseStatus.waitingConsultation.name,
      medicalCaseStatus.waitingTest.name,
      medicalCaseStatus.waitingDiagnostic.name,
    ],
  };

  async componentWillMount() {
    const { navigation } = this.props;

    // Force refresh with a navigation.push
    navigation.addListener('willFocus', async () => {
      await this.filterMedicalCases();
    });
  }

  // Get all medical case with waiting for... status
  filterMedicalCases = async () => {
    this.setState({ loading: true });
    const { medicalCase } = this.props;

    let patients = await getArray('patients');
    let medicalCases = [];

    patients.map((patient) => {
      patient.medicalCases.map((medicalCaseLocalStorage) => {

        if (medicalCaseLocalStorage.id !== medicalCase.id) {
          medicalCaseLocalStorage.patient = { ...patient, medicalCases: [] };
          medicalCases.push(medicalCaseLocalStorage);
        } else {
          medicalCase.patient = { ...patient, medicalCases: [] };
          medicalCases.push(medicalCase);
        }
      });
    });

    this.setState(
      {
        medicalCases: medicalCases,
      },
      () => this.settleMedicalCase()
    );
  };

  // Update state switch asc / desc
  orderByName = () => {
    const { orderByName } = this.state;
    this.setState(
      {
        orderByStatus: null,
        orderBySurName: null,
        orderByUpdate: null,
        orderByName: orderByName === 'asc' ? 'desc' : 'asc',
      },
      () => this.settleMedicalCase()
    );
  };

  orderBySurName = () => {
    const { orderBySurName } = this.state;
    this.setState(
      {
        orderByStatus: null,
        orderByUpdate: null,
        orderByName: null,
        orderBySurName: orderBySurName === 'asc' ? 'desc' : 'asc',
      },
      () => this.settleMedicalCase()
    );
  };

  // Update state switch asc / desc
  orderByStatus = () => {
    const { orderByStatus } = this.state;
    this.setState(
      {
        orderByName: null,
        orderBySurName: null,
        orderByUpdate: null,
        orderByStatus: orderByStatus === 'asc' ? 'desc' : 'asc',
      },
      () => this.settleMedicalCase()
    );
  };

  orderByUpdate = () => {
    const { orderByUpdate } = this.state;

    this.setState(
      {
        orderBySurName: null,
        orderByName: null,
        orderByUpdate: orderByUpdate === 'asc' ? 'desc' : 'asc',
        orderByStatus: null,
      },
      () => this.settleMedicalCase()
    );
  };

  // Reset all filter by default
  resetFilter = () => {
    this.setState(
      {
        searchTerm: '',
        orderByName: 'asc',
        filterTerm: '',
        orderByUpdate: null,
        orderBySurName: null,
      },
      () => this.settleMedicalCase()
    );
  };

  // Filter by status
  filterBy = (filterTerm) => {
    this.setState({ filterTerm }, () => this.settleMedicalCase());
  };

  // Sets in the  state a list of medical cases based on filters and orders
  settleMedicalCase = () => {
    this.setState({ loading: true });
    const { medicalCases, searchTerm, orderByName, filterTerm, orderByStatus, orderByUpdate, orderBySurName } = this.state;

    // Filter patient based on first name and last name by search term
    let filteredMedicalCases = filter(medicalCases, (medicalCase) => {
      return (
        medicalCase.patient?.firstname?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        medicalCase.patient?.lastname?.toLowerCase().includes(searchTerm?.toLowerCase())
      );
    });
    // Filter patient based on medical case status
    filteredMedicalCases = filter(filteredMedicalCases, (medicalCase) => {
      return medicalCase.status === filterTerm || filterTerm === '';
    });
    let orderedFilteredMedicalCases;

    if (orderByName !== null) {
      orderedFilteredMedicalCases = orderBy(filteredMedicalCases, 'patient.lastname', orderByName);
    } else if (orderBySurName !== null) {
      orderedFilteredMedicalCases = orderBy(filteredMedicalCases, 'patient.firstname', orderBySurName);
    } else if (orderByStatus !== null) {
      orderedFilteredMedicalCases = orderBy(filteredMedicalCases, ['status'], [orderByStatus]);
    } else if (orderByUpdate !== null) {
      orderedFilteredMedicalCases = filteredMedicalCases;
      orderedFilteredMedicalCases.sort((a, b) => {
        let dateA = moment(a.updated_at);
        let dateB = moment(b.updated_at);

        if (orderByUpdate === 'asc') {
          return dateB.diff(dateA);
        } else if (orderByUpdate === 'desc') {
          return dateA.diff(dateB);
        }
      });
    }

    this.setState({ orderedFilteredMedicalCases, loading: false });
  };

  // Set string search
  searchBy = (searchTerm) => {
    this.setState({ searchTerm });
  };

  // Select a medical case and redirect to patient's view
  selectMedicalCase = async (medicalCase) => {
    const { setMedicalCase } = this.props;
    await setMedicalCase(medicalCase);
  };

  _renderMedicalCase = () => {
    const {
      app: { t },
    } = this.props;

    const { medicalCase, navigation } = this.props;

    const { orderedFilteredMedicalCases, medicalCases } = this.state;

    return medicalCases.length > 0 ? (
      [
        orderedFilteredMedicalCases.length > 0 ? (
          <List block key="medicalCaseList">
            {orderedFilteredMedicalCases.map((medicalCaseItem) => (
              <ListItem
                rounded
                block
                style={{
                  backgroundColor: '#ffffff',
                }}
                key={medicalCaseItem.id + '_medical_case_list'}
                spaced
                onPress={async () => {
                  let medicalCaseRoute = medicalCase.id === medicalCaseItem.id ? medicalCase : medicalCaseItem;

                  if (medicalCase.id !== medicalCaseItem.id) {
                    await this.selectMedicalCase({
                      ...medicalCaseItem,
                    });
                  }

                  let route = routeDependingStatus(medicalCaseRoute);
                  if (route !== undefined) {
                    navigation.navigate(route);
                  }
                }}
              >
                <View w50>
                  <Text>
                    {medicalCaseItem.patient.id} : {medicalCaseItem.patient.lastname} {medicalCaseItem.patient.firstname}
                  </Text>
                </View>
                <View w50>
                  <Text>{t(`medical_case:${medicalCase.id === medicalCaseItem.id ? medicalCase.status : medicalCaseItem.status}`)}</Text>
                </View>

                <View w50>
                  <Text>
                    {medicalCase.id === medicalCaseItem.id ? moment(medicalCase.updated_at).calendar() : moment(medicalCaseItem.updated_at).calendar()}
                  </Text>
                </View>
              </ListItem>
            ))}
          </List>
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{t('medical_case_list:not_found')}</Text>
          </View>
        ),
      ]
    ) : (
      <View padding-auto margin-auto>
        <Text not-available>{t('medical_case_list:no_medical_cases')}</Text>
      </View>
    );
  };

  render() {
    const { searchTerm, orderByName, statuses, filterTerm, orderByStatus, loading, orderByUpdate, orderBySurName } = this.state;

    const {
      app: { t },
    } = this.props;

    // Order the medical case
    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>{t('medical_case_list:search')}</LiwiTitle2>
          <View flex-container-row>
            <Item round style={styles.input}>
              <Icon active name="search" />
              <Input value={searchTerm} onChangeText={this.searchBy} />
            </Item>
          </View>
          <View flex-container-row style={styles.filter}>
            <Button center rounded light onPress={this.resetFilter}>
              <Text>{t('medical_case_list:all')}</Text>
            </Button>
            <Text style={styles.textFilter}>{t('medical_case_list:waiting')}</Text>
            <Picker style={styles.picker} mode="dropdown" selectedValue={filterTerm} onValueChange={this.filterBy}>
              <Picker.Item label="" value="" />
              {statuses.map((status) => (
                <Picker.Item label={t(`medical_case_list:${status}`)} key={status + 'status_list'} value={status} />
              ))}
            </Picker>
          </View>

          <SeparatorLine />

          <View flex-container-row style={styles.sorted}>
            <Text style={styles.textSorted}>{t('medical_case_list:sort')}</Text>
            <View style={styles.filters}>
              <Button center rounded light onPress={this.orderByName}>
                {orderByName === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
                <Text>{t('medical_case_list:name')}</Text>
              </Button>
              <Button center rounded light onPress={this.orderBySurName}>
                {orderBySurName === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
                <Text>{t('medical_case_list:surname')}</Text>
              </Button>
              <Button center rounded light onPress={this.orderByStatus}>
                {orderByStatus === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
                <Text>{t('medical_case_list:status')}</Text>
              </Button>
              <Button center rounded light onPress={this.orderByUpdate}>
                {orderByUpdate === 'asc' ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />}
                <Text>{t('medical_case_list:update')}</Text>
              </Button>
            </View>
          </View>
          {loading ? <LiwiLoader /> : this._renderMedicalCase()}
        </View>
      </ScrollView>
    );
  }
}
