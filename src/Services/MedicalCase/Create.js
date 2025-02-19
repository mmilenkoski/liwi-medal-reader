/**
 * The external imports
 */
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { GenerateNodesService } from '@/Services/Node'

export default async ({ algorithm, patientId }) => {
  return {
    activities: [],
    comment: '',
    consent: !!algorithm.config.consent_management,
    createdAt: new Date().getTime(),
    closedAt: 0,
    diagnosis: {
      proposed: [],
      excluded: [],
      additional: {},
      agreed: {},
      refused: [],
      custom: {},
    },
    id: uuid.v4(),
    patient_id: patientId,
    nodes: GenerateNodesService({ nodes: algorithm.nodes }),
    json: '',
    advancement: {
      stage: 0,
      step: 0,
    },
    synchronizedAt: 0,
    json_version: algorithm.json_version,
    updatedAt: new Date().getTime(),
    version_id: algorithm.version_id,
    fail_safe: false,
    savedInDatabase: false,
  }
}
