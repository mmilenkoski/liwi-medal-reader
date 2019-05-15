import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { TouchableWithoutFeedback } from 'react-native';
import { styles } from './CustomModal.style';
import { Text, View } from 'native-base';

export default class CustomModal extends Component {
  state = {};

  static defaultProps = {
    isModalVisible: false,
    contentModal: 'Default',
  };

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    const { app: { isModalVisible, contentModal, set } }= this.props;
    return (
      <View style={styles.container}>
        <Modal
          isVisible={isModalVisible}
          backdropOpacity={0.5}
          onSwipeComplete={() => set('isModalVisible', false)}
          swipeDirection={'up'}
        >
          <View style={styles.view}>
            <Text>{contentModal}</Text>
            <TouchableWithoutFeedback onPress={() => set('isModalVisible', false)}>
              <Text>Hide me!</Text>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }
}
