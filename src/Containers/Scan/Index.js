/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { View, Text, Dimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'
import { useNavigation } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import CreatePatient from '@/Store/Patient/Create'
import HandleQr from '@/Store/Scan/HandleQr'
import LoadPatient from '@/Store/Patient/Load'
import { transformPatientValues } from '@/Utils/MedicalCase'
import UpdateNodeFields from '@/Store/MedicalCase/UpdateNodeFields'
import { navigateAndSimpleReset, navigate } from '@/Navigators/Root'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
const IndexScanContainer = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigation = useNavigation()

  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { scan },
  } = useTheme()

  // Get values from the store
  const healthFacility = useSelector(state => state.healthFacility.item)
  const algorithm = useSelector(state => state.algorithm.item)
  const handleQrError = useSelector(state => state.scan.handleQr.error)
  const medicalCaseError = useSelector(state => state.medicalCase.create.error)
  const scanData = useSelector(state => state.scan.item)
  const patientLoadError = useSelector(state => state.patient.load.error)

  // Local state definition
  const [generateNewQR, setGenerateNewQR] = useState(false)
  const [otherQR, setOtherQR] = useState({})
  const [lastScan, setLastScan] = useState({})

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () =>
      dispatch(HandleQr.action({ reset: true })),
    )

    return unsubscribe
  }, [navigation])

  /**
   * Will navigate to the medical case with the appropriate params
   */
  const openMedicalCase = async () => {
    if (scanData.navigate) {
      if (scanData.navigationParams.newMedicalCase) {
        const patientResult = await dispatch(
          CreatePatient.action({ ...scanData.navigationParams }),
        )
        if (isFulfilled(patientResult)) {
          const medicalCaseResult = await dispatch(
            CreateMedicalCase.action({
              algorithm,
              patientId: patientResult.payload.id,
            }),
          )
          if (isFulfilled(medicalCaseResult)) {
            navigate('Home', {
              screen: 'StageWrapper',
              ...scanData.navigationParams,
            })
          }
        }
      } else {
        const loadPatientResult = await dispatch(
          LoadPatient.action({
            patientId: scanData.navigationParams.patientId,
          }),
        )

        if (isFulfilled(loadPatientResult)) {
          const medicalCaseResult = await dispatch(
            CreateMedicalCase.action({
              algorithm,
              patientId: scanData.navigationParams.patientId,
            }),
          )
          if (isFulfilled(medicalCaseResult)) {
            const patientValueNodes = transformPatientValues()
            await dispatch(
              UpdateNodeFields.action({ toUpdate: patientValueNodes }),
            )
            navigate('Home', {
              screen: 'StageWrapper',
              ...scanData.navigationParams,
            })
          }
        }
      }
    }
  }

  /**
   * Handles navigation after Scan successful
   */
  useEffect(() => {
    openMedicalCase(scanData)
  }, [scanData])

  /**
   * Retrieves needed data in cas of error. and sets them in local state
   */
  useEffect(() => {
    if (handleQrError?.data) {
      setOtherQR(handleQrError?.data.QRData)
      setGenerateNewQR(handleQrError?.data.generateNewQr)
    }
  }, [handleQrError?.data])

  /**
   * Handle scan process
   */
  const handleScan = async e => {
    // If the QR code is the same as the one that has been scanned before
    if (isEqual(lastScan, e.data)) {
      return
    }
    setLastScan(e.data)
    await dispatch(
      HandleQr.action({
        QrRawData: e.data,
        healthFacilityId: healthFacility.id,
        generateNewQR,
        otherQR,
      }),
    )
  }
  return (
    <QRCodeScanner
      showMarker
      vibrate
      reactivate
      reactivateTimeout={2000}
      onRead={handleScan}
      cameraStyle={{ height: HEIGHT }}
      customMarker={
        <View style={scan.wrapper}>
          <View style={scan.titleWrapper(handleQrError)}>
            <Text style={scan.title}>{t('containers.scan.scan')}</Text>
          </View>

          <View style={Layout.row}>
            <View style={scan.leftScan(handleQrError)} />

            <View style={scan.centerScan}>
              <Icon name="qr-scan" size={WIDTH * 0.5} />
            </View>

            <View style={scan.rightScan(handleQrError)} />
          </View>

          <View style={scan.bottomWrapper(handleQrError)}>
            {(handleQrError || medicalCaseError || patientLoadError) && (
              <View style={scan.errorWrapper}>
                {handleQrError && (
                  <Text style={scan.errorTitle}>{handleQrError.message}</Text>
                )}
                {medicalCaseError && (
                  <Text style={scan.errorTitle}>
                    {medicalCaseError.message}
                  </Text>
                )}
                {patientLoadError && (
                  <Text style={scan.errorTitle}>
                    {patientLoadError.message}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      }
    />
  )
}

export default IndexScanContainer
