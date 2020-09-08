// @flow

import * as React from 'react';
import { Text, Card, CardItem, Body, View, Icon } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import { TouchableOpacity } from 'react-native';
import { styles } from './FinalDiagnosticCards.style';
import { LiwiTitle2 } from '../../template/layout';
import { getDrugs } from '../../../frontend_service/algorithm/questionsStage.algo';
import { medicationForms, modalType } from '../../../frontend_service/constants';

import Liquid from '../Formulations/Liquid';
import Breakable from '../Formulations/Breakable';
import Capsule from '../Formulations/Capsule';
import Default from '../Formulations/Default';
import { calculateCondition } from '../../../frontend_service/algorithm/conditionsHelpers.algo';

type Props = NavigationScreenProps & {};
type State = {};

export default class FinalDiagnosticCards extends React.Component<Props, State> {
  /**
   * Display drug formulation based on medication form selected
   * @param {Object} drug - Drug in final diagnostic model
   * @returns {*}
   * @private
   */
  _renderSwitchFormulation = (drug) => {
    const {
      app: { t },
      medicalCase: { nodes },
    } = this.props;

    const node = nodes[drug.id];
    const drugDose = node.getDrugDoses(drug.formulationSelected);

    if (node.formulations[drug.formulationSelected] !== undefined) {
      switch (node.formulations[drug.formulationSelected].medication_form) {
        case medicationForms.syrup:
        case medicationForms.suspension:
        case medicationForms.powder_for_injection:
        case medicationForms.solution:
          return Liquid(drug, node, drugDose);
        case medicationForms.tablet:
          return Breakable(drug, node, drugDose);
        case medicationForms.capsule:
          return Capsule(drug, node, drugDose);
        default:
          return Default(drug, node, drugDose);
      }
    } else {
      return <Text italic>{t('drug:missing_medicine_formulation')}</Text>;
    }
  };

  /**
   * Open redux modal
   */
  openModal = (node) => {
    const { updateModalFromRedux } = this.props;
    updateModalFromRedux({ node }, modalType.description);
  };

  /**
   * Display final diagnostic cards with medicine and management choose
   * @param {Object} finalDiagnosticCategory - Diagnoses entry in medical case
   * @param {String} title - Diagnoses key
   * @returns {Array<unknown>}
   * @private
   */
  _renderFinalDiagnosticCards = (finalDiagnosticCategory, title) => {
    const {
      app: { t },
      medicalCase,
      medicalCase: { nodes },
    } = this.props;

    const drugsAvailable = getDrugs(medicalCase.diagnoses);

    return Object.keys(finalDiagnosticCategory).map((key) => {
      if (finalDiagnosticCategory[key].agreed || title === 'additional') {
        return (
          <Card key={key}>
            <CardItem style={styles.cardItemCondensed}>
              <Body style={styles.cardTitleContent}>
                <LiwiTitle2 noBorder style={styles.flex}>
                  {finalDiagnosticCategory[key].label}
                </LiwiTitle2>
                <LiwiTitle2 noBorder style={styles.noRightMargin}>
                  <Text note>{t(`diagnoses_label:${title}`)}</Text>
                </LiwiTitle2>
              </Body>
            </CardItem>
            <CardItem style={styles.cardItemCondensed}>
              <Body>
                <LiwiTitle2 noBorder style={styles.cardTitle}>
                  {t('diagnoses:medicines')}
                </LiwiTitle2>

                {finalDiagnosticCategory[key].drugs !== undefined && Object.keys(finalDiagnosticCategory[key].drugs).length > 0 ? (
                  Object.keys(finalDiagnosticCategory[key].drugs).map((drugKey) => {
                    if (drugsAvailable[drugKey] !== undefined) {
                      return (
                        <View style={styles.drugContainer}>
                          <View flex>{this._renderSwitchFormulation(drugsAvailable[drugKey])}</View>
                          <View style={styles.tooltipButton}>
                            <View flex="1">
                              <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(drugsAvailable[drugKey])}>
                                <Icon type="AntDesign" name="info" style={styles.iconInfo} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    }
                  })
                ) : (
                  <Text italic>{t('diagnoses:no_medicines')}</Text>
                )}
              </Body>
            </CardItem>
            <CardItem style={styles.cardItemCondensed}>
              <Body>
                <LiwiTitle2 noBorder style={styles.cardTitle}>
                  {t('diagnoses:management')}
                </LiwiTitle2>
                {finalDiagnosticCategory[key].managements !== undefined && Object.keys(finalDiagnosticCategory[key].managements).length > 0 ? (
                  Object.keys(finalDiagnosticCategory[key].managements).map((managementKey) => {
                    const management = finalDiagnosticCategory[key].managements[managementKey];
                    const node = nodes[management.id];
                    if (calculateCondition(management) === true) {
                      return (
                        <View style={styles.drugContainer}>
                          <Text key={`${managementKey}-management`}>{node.label}</Text>
                          <View style={styles.tooltipButton}>
                            <View flex="1">
                              <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal(node)}>
                                <Icon type="AntDesign" name="info" style={styles.iconInfo} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    }
                    return null;
                  })
                ) : (
                  <Text italic>{t('diagnoses:no_managements')}</Text>
                )}
              </Body>
            </CardItem>
          </Card>
        );
      }
      return null;
    });
  };

  render() {
    const { medicalCase } = this.props;
    return Object.keys(medicalCase.diagnoses).map((key) => this._renderFinalDiagnosticCards(medicalCase.diagnoses[key], key));
  }
}
