// @flow
import React from 'react';
import { Body, Card, CardItem, Text, View } from 'native-base';
import * as _ from 'lodash';

import Medicine from '../Medicine';
import { LiwiTitle2 } from '../../template/layout';
import { styles } from './MedicineSelection.style';
import { finalDiagnosticGetDrugs, finalDiagnosticGetManagements } from '../../../frontend_service/helpers/FinalDiagnostic.model';
import { translateText } from '../../utils/i18n';

export default function MedicineSelection(props) {
  const { algorithm, t, diagnosesFinalDiagnostic, medicalCase, diagnoseKey, algorithmLanguage } = props;

  const mcFinalDiagnostic = medicalCase.nodes[diagnosesFinalDiagnostic.id];
  const drugs = finalDiagnosticGetDrugs(algorithm, medicalCase, mcFinalDiagnostic);
  const managements = finalDiagnosticGetManagements(algorithm, medicalCase, mcFinalDiagnostic);

  const orderedManagement = _.orderBy(managements, (management) => management.level_of_urgency, ['desc', 'asc']);

  return (
    <Card key={`finalDiagnostic_${diagnosesFinalDiagnostic.id}`}>
      <CardItem style={styles.cardItemCondensed}>
        <View style={styles.cardTitleContent}>
          <Text customSubTitle style={styles.cardTitle}>
            {translateText(diagnosesFinalDiagnostic.label, algorithmLanguage)}
          </Text>
          <LiwiTitle2 noBorder style={styles.noRightMargin}>
            <Text note>{t(`diagnoses_label:${diagnoseKey}`)}</Text>
          </LiwiTitle2>
        </View>
      </CardItem>
      <CardItem style={styles.cardItemCondensed}>
        <Body>
          <LiwiTitle2 noBorder style={styles.cardTitle}>
            {t('diagnoses:drugs')}
          </LiwiTitle2>
          {drugs.length > 0 ? (
            drugs.map((drug) => (
              <Medicine
                healthCareType="drugs"
                diagnoseKey={diagnoseKey}
                key={`${diagnosesFinalDiagnostic.id}_${drug.id}_medicine`}
                medicine={diagnosesFinalDiagnostic.drugs[drug.id]}
                finalDiagnosticId={diagnosesFinalDiagnostic.id}
                node={algorithm.nodes[drug.id]}
              />
            ))
          ) : (
            <Text style={styles.padding} key={`${diagnosesFinalDiagnostic.id}_drugs_diagnoses`} italic>
              {t('diagnoses:no_drugs')}
            </Text>
          )}
          <LiwiTitle2 noBorder style={styles.cardTitle}>
            {t('diagnoses:management')}
          </LiwiTitle2>
          {managements.length > 0 ? (
            orderedManagement.map((management) => (
              <Medicine
                healthCareType="managements"
                diagnoseKey={diagnoseKey}
                key={`${diagnosesFinalDiagnostic.id}_${management.id}_medicine`}
                medicine={diagnosesFinalDiagnostic.managements[management.id]}
                finalDiagnosticId={diagnosesFinalDiagnostic.id}
                node={algorithm.nodes[management.id]}
              />
            ))
          ) : (
            <Text style={styles.padding} key={`${diagnosesFinalDiagnostic.id}_managements_diagnoses`} italic>
              {t('diagnoses:no_managements')}
            </Text>
          )}
        </Body>
      </CardItem>
    </Card>
  );
}
