import * as React from 'react';

import { Image, ScrollView } from 'react-native';
import { Button, Icon, Text, View } from 'native-base';
import { styles } from './ToolTipModal.style';
import Tooltip from '../Tooltip/tooltip';
import NavigationService from '../../engine/navigation/Navigation.service';
import { SeparatorLine } from '../../template/layout';

// TODO implement scu

export default class TooltipModal extends React.Component<Props, State> {
  static defaultProps = {
    toolTipIcon: false,
  };

  state = {
    toolTipVisible: false,
  };

  _renderQuestions = (questions) => {
    const {
      app: { t },
    } = this.props;

    let rowQuestions = [];

    let n = 0;

    while (n < questions.length) {
      rowQuestions.push(
        <Text>
          - {questions[n].id} - {questions[n].label}
        </Text>
      );

      if (n === 2) {
        rowQuestions.push(
          <Text>
            {questions.length - 3} {t('tooltip:more')}
          </Text>
        );
        break;
      } else {
        n++;
      }
    }

    return rowQuestions;
  };

  _renderValidation = () => {
    const { screenToBeFill, stepToBeFill, routeRequested } = this.props.modalRedux.navigator;
    const {
      app: { t },
      patientId,
    } = this.props;

    return (
      <View style={styles.validation}>
        <Text style={styles.warning}>Access refused !</Text>
        <Image source={require('../../../assets/images/hand.png')} style={styles.hand} resizeMode="contain" />
        <Text style={styles.blocScreen}>
          <Text style={styles.screen}>{screenToBeFill}</Text> {t('tooltip:notcomplete')}
        </Text>
        <SeparatorLine marginBottom={15} marginTop={15} />
        <View style={styles.stepContainer}>
          {stepToBeFill.map((step) => (
            <View key={'step-name' + step.stepName}>
              <View style={styles.stepHeaderName}>
                <Icon type="Ionicons" name="ios-arrow-round-forward" />
                <Text style={styles.stepName}>{step.stepName}</Text>
                {step.isActionValid ? (
                  <Icon name="ios-checkmark" type="Ionicons" style={styles.iconValid} />
                ) : (
                  <Icon name="cross" type="Entypo" style={styles.iconInValid} />
                )}
              </View>
              <View style={styles.questions}>{this._renderQuestions(step.questionsToBeFill)}</View>
            </View>
          ))}
          <SeparatorLine marginBottom={15} marginTop={15} />
          <View style={{ flexDirection: 'row' }}>
            <Button
              style={styles.buttonNav}
              light
              onPress={() => {
                this.closeModal();
                const params = { force: true };
                NavigationService.navigate(routeRequested, params);
              }}
            >
              <Text>
                {t('tooltip:forcegoto')} {routeRequested}
              </Text>
            </Button>
            <Button
              style={styles.buttonNav}
              success
              onPress={() => {
                this.closeModal();
                let params = {};

                if (screenToBeFill === 'PatientUpsert') {
                  params.idPatient = patientId;
                  params.newMedicalCase = false;
                }

                NavigationService.navigate(screenToBeFill, params);
              }}
            >
              <Text>
                {t('tooltip:goto')} {screenToBeFill}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  };

  _renderToolTipContent = () => {
    const { modalRedux, children, toolTipIcon } = this.props;
    const { toolTipVisible } = this.state;

    const isFromRedux = modalRedux.open;
    const isFromJsx = toolTipVisible || toolTipIcon;

    return (
      <View>
        <ScrollView>
          <View onStartShouldSetResponder={() => true}>
            <Button onPress={this.closeModal} rounded style={styles.button}>
              <Icon name="close" type="AntDesign" style={styles.icon} />
            </Button>
            {isFromJsx && children}
            {isFromRedux ? modalRedux.content !== null ? <Text>{modalRedux.content}</Text> : this._renderValidation() : null}
          </View>
        </ScrollView>
      </View>
    );
  };

  /**
   * Close the tooltip when the click is outside the tooltip
   *
   * Callback receive from the tooltip component when it ask for close itself
   *
   * @param reactNative : reactNative.nativeEvent is the data from react native who
   *                      has all info about the screen size (in point) gives the position of the click
   * @param toolTip : data from the tooltip like origin on screen and size gives the position of the tooltip
   */
  onCloseToolTip = (reactNative, toolTip) => {
    let xTouch = reactNative.nativeEvent.pageX;
    let xTooltip = toolTip.tooltipOrigin.x;
    let xEndToolTip = toolTip.tooltipOrigin.x + toolTip.contentSize.width;

    let yTouch = reactNative.nativeEvent.pageY;
    let yTooltip = toolTip.tooltipOrigin.y;
    let yEndToolTip = toolTip.tooltipOrigin.y + toolTip.contentSize.height;

    let insideContent = xTouch > xTooltip && xTouch < xEndToolTip && (yTouch > yTooltip && yTouch < yEndToolTip);

    if (!insideContent) {
      this.closeModal();
    }
  };

  closeModal = () => {
    const { modalRedux, updateModalFromRedux, toolTipIcon } = this.props;
    const { toolTipVisible } = this.state;

    const isFromRedux = modalRedux.open;
    const isFromJsx = toolTipVisible || toolTipIcon;

    if (isFromRedux) {
      updateModalFromRedux();
    }

    if (isFromJsx) {
      this.setState({ toolTipVisible: false });
    }
  };

  render() {
    const { toolTipVisible } = this.state;
    const { flex, modalRedux, toolTipIcon } = this.props;

    const isFromRedux = modalRedux.open;
    const isFromJsx = toolTipVisible || toolTipIcon;
    const isVisible = isFromRedux || toolTipVisible;

    if (isFromJsx === false && isFromRedux === false) {
      return null;
    }

    return (
      <View flex={flex}>
        {toolTipIcon ? (
          <Button style={styles.touchable} transparent onPress={() => this.setState({ toolTipVisible: true })}>
            <Icon type="AntDesign" name="info" style={styles.iconInfo} />
          </Button>
        ) : null}

        <Tooltip
          isVisible={isVisible}
          closeOnChildInteraction={false}
          showChildInTooltip={false}
          content={this._renderToolTipContent()}
          placement="center"
          onClose={this.onCloseToolTip}
        />
      </View>
    );
  }
}
