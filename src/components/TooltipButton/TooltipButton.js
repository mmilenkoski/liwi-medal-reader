import * as React from 'react';

import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { styles } from './TooltipButton.style';
import { LiwiTitle5 } from '../../template/layout';
import Tooltip from '../Tooltip/tooltip';
import Media from '../Media/Media';

export default class TooltipButton extends React.Component<Props, State> {
  state = {
    toolTipVisible: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { toolTipVisible } = this.state;
    return nextState.toolTipVisible !== toolTipVisible;
  }

  /**
   * Tooltip content
   * @returns {*}
   * @private
   */
  _renderToolTipContent = () => {
    const { node, title } = this.props;

    return (
      <ScrollView>
        <View onStartShouldSetResponder={() => true}>
          <Button onPress={() => this.setState({ toolTipVisible: false })} rounded style={styles.button}>
            <Icon name="close" type="AntDesign" style={styles.icon} />
          </Button>
          <LiwiTitle5>{title}</LiwiTitle5>
          <Text style={styles.description}>{node.description}</Text>
          {node.urls !== undefined && node.urls.length > 0
            ? [node.urls].map((url) => {
                return <Media key={url} url={url} />;
              })
            : null}
          {__DEV__ ? <Text>id: {node.id}</Text> : null}
        </View>
      </ScrollView>
    );
  };

  /**
   * Close the tooltip when the click is outside the tooltip
   * Callback receive from the tooltip component when it ask for close itself
   *
   * @param reactNative : reactNative.nativeEvent is the data from react native who
   *                      has all info about the screen size (in point) gives the position of the click
   * @param toolTip : data from the tooltip like origin on screen and size gives the position of the tooltip
   */
  onCloseToolTip = (reactNative, toolTip) => {
    const xTouch = reactNative.nativeEvent.pageX;
    const xTooltip = toolTip.tooltipOrigin.x;
    const xEndToolTip = toolTip.tooltipOrigin.x + toolTip.contentSize.width;

    const yTouch = reactNative.nativeEvent.pageY;
    const yTooltip = toolTip.tooltipOrigin.y;
    const yEndToolTip = toolTip.tooltipOrigin.y + toolTip.contentSize.height;

    const insideContent = xTouch > xTooltip && xTouch < xEndToolTip && yTouch > yTooltip && yTouch < yEndToolTip;

    if (!insideContent) {
      this.setState({ toolTipVisible: false });
    }
  };

  render() {
    const { toolTipVisible } = this.state;
    const { flex } = this.props;

    return (
      <View flex={flex}>
        <TouchableOpacity style={styles.touchable} transparent onPress={() => this.setState({ toolTipVisible: true })}>
          <Icon type="AntDesign" name="info" style={styles.iconInfo} />
        </TouchableOpacity>
        <Tooltip isVisible={toolTipVisible} closeOnChildInteraction={false} showChildInTooltip={false} content={this._renderToolTipContent()} onClose={this.onCloseToolTip} />
      </View>
    );
  }
}
