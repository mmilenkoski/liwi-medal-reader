import { store } from '@/Store'
import LoadAlgorithm from '@/Store/Algorithm/Load'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import AddCustomDiagnoses from '@/Store/MedicalCase/Diagnoses/AddCustomDiagnoses'
import AddCustomDrugs from '@/Store/MedicalCase/Drugs/AddCustomDrugs'
import ChangeCustomDrugDuration from '@/Store/MedicalCase/Drugs/ChangeCustomDrugDuration'
import AddAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAdditionalDiagnoses'
import ArmAddCustomDrugs from '@/Store/MedicalCase/ArmControl/ArmAddCustomDrugs'
import ArmRemoveCustomDrugs from '@/Store/MedicalCase/ArmControl/ArmRemoveCustomDrugs'
import ArmChangeCustomDrugDuration from '@/Store/MedicalCase/ArmControl/ArmChangeCustomDrugDuration'

beforeAll(async () => {
  const algorithmFile = require('../../../algorithm.json')
  await store.dispatch(
    LoadAlgorithm.action({
      newAlgorithm: algorithmFile,
    }),
  )
  const algorithm = store.getState().algorithm.item
  await store.dispatch(CreateMedicalCase.action({ algorithm }))

  const diagnosisId = 60
  const drugId = 1679
  const node = algorithm.nodes[diagnosisId]

  await store.dispatch(
    AddAdditionalDiagnoses.action({
      newAdditionalDiagnoses: {
        [diagnosisId]: {
          id: diagnosisId,
          managements: Object.values(node.managements).map(
            management => management.id,
          ),
          drugs: {
            proposed: Object.values(node.drugs).map(drug => drug.id),
            agreed: {},
            refused: [],
            additional: {},
            custom: {},
          },
        },
      },
    }),
  )

  await store.dispatch(
    ArmAddCustomDrugs.action({
      diagnosisId,
      drugId,
      drugContent: {
        id: drugId,
        name: 'Alcohol',
        duration: '',
      },
    }),
  )
})

describe('Handle custom drugs duration change for Arm Control', () => {
  const diagnosisId = 60
  const drugId = 1679
  const duration = '7'

  it('should start with an additional diagnosis', () => {
    expect(
      Object.keys(
        store.getState().medicalCase.item.diagnosis.additional,
      ).includes(diagnosisId.toString()),
    ).toBe(true)
  })

  it('should start with custom drugs in an additional diagnosis', () => {
    expect(
      store.getState().medicalCase.item.diagnosis.additional[diagnosisId].drugs
        .custom,
    ).toStrictEqual({
      [drugId]: {
        id: drugId,
        name: 'Alcohol',
        duration: '',
      },
    })
  })

  it('should change custom drug duration in an additional diagnostic', async () => {
    store.dispatch(
      ArmChangeCustomDrugDuration.action({
        diagnosisId,
        drugId,
        duration,
      }),
    )

    expect(
      store.getState().medicalCase.item.diagnosis.additional[diagnosisId].drugs
        .custom[drugId].duration,
    ).toBe(duration)
  })
})
