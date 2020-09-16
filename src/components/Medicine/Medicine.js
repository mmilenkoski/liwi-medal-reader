import React, { Component } from 'react';

import { Button, Icon, Text, View } from 'native-base';
import { LeftButton, RightButton } from '../../template/layout';
import { styles } from './Medicine.style';

export default class Medicine extends Component<{}> {
  _handleClick = (boolean) => {
    const { medicine, diagnosesKey, setMedicine, type } = this.props;
    if (boolean !== medicine.agreed) {
      setMedicine(type, diagnosesKey, medicine.id, boolean);
    }
  };

  shouldComponentUpdate(nextProps) {
    const { medicine } = this.props;
    return nextProps.medicine.agreed !== medicine.agreed;
  }

  render() {
    const {
      medicine,
      node,
      app: { t },
    } = this.props;

    return (
      <>
        <View style={styles.main} margin-top>
          <View style={styles.flex}>
            <Text size-auto>{node?.label}</Text>
            <Text italic>
              {t('drug:d')} : {medicine.duration} {t('drug:days')}
            </Text>
          </View>

          <View style={styles.content}>
            <LeftButton active={medicine.agreed === true} onPress={() => this._handleClick(true)}>
              <Text white={medicine.agreed === true} center style={styles.label}>
                {t('diagnoses:agree')}
              </Text>
            </LeftButton>
            <RightButton onPress={() => this._handleClick(false)} active={medicine.agreed === false}>
              <Text center white={medicine.agreed === false} style={styles.label}>
                {t('diagnoses:disagree')}
              </Text>
            </RightButton>
            <Button style={styles.smallFlex}>
              <Icon name="block" type="Entypo" style={styles.iconSize} />
            </Button>
          </View>
        </View>
        {node?.description !== null ? (
          <View margin-top>
            <Text size-auto>{node?.description}</Text>
          </View>
        ) : null}
      </>
    );
  }
}
