/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';

/**
 * The internal imports
 */
import { SquareButton } from '@/Components'
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'

import *  as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';

const Predictions = () => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Components: { modal },
  } = useTheme()

  const dispatch = useDispatch()

  const { t } = useTranslation()
  console.log('TESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT')
  const [prediction, setPrediction] = useState('');
    useEffect(() => {
       async function getPrediction() {
            const model = await mobilenet.load();
            const uri = 'http://example.com/food.jpg';
            console.log(uri)
            const response = await fetch(uri, {}, { isBinary: true });
            console.log(response)
            const imageData = await response.arrayBuffer();
            const imageTensor = decodeJpeg(imageData);

            const prediction = (await model.predict(imageTensor))[0];
            setPrediction(prediction);
       }
       console.log('OUTSIDEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
       getPrediction();
    }, [])

  /**
   * Toggle the modal visibility
   * @returns {Promise<void>}
   */
  const handleOnPress = async () => {
    await dispatch(ToggleVisibility.action({}))
  }

//  console.log('gfdgdfgdfgdfgdfgfdgdfgdfgdfgdfgdfgdfgdfgdfgdfgdfgdfgdfgdfgdg')
//  url = '../../../Assets/MLModels/continuous_feature_encoders_lab_udip_ket_d0.onnx'
//  var model = new tf.onnx.loadModel(url);

//  const input = new Float32Array(Array.from({length: 41}, () => Math.floor(Math.random() * 40)));
//
//  const inputs = [
//    new Tensor(input, "float32", [1, 41]),
//  ];
//
//  const outputMap = model.predict(inputs);
//  const prediction = outputMap.values().next().value;
//  console.log(outputMap)
//  console.log(outputTensor)

  return (
    <View>
      <Text style={modal.header}>{'Predictions'}</Text>
      <Text style={modal.body}>{'Disease 1: 60%'}{'\n'}{prediction}</Text>

      <View style={modal.buttonWrapper}>
        <SquareButton
          label='Close'
          filled
          onPress={handleOnPress}
          bgColor={Colors.red}
          color={Colors.white}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default Predictions
