// @flow

import uuid from 'react-native-uuid';
import { getItem } from '../../../src/engine/api/LocalStorage';
import { getDeviceInformation } from '../../../src/engine/api/Device';
import { moment } from 'moment';

export class ActivityModel {
  constructor(props) {

    return (async () => {
      const { stage, nodes, user, medical_case_id } = props;
      const session = await getItem('session');
      const deviceInfo = await getDeviceInformation();

      this.id = uuid.v4();
      this.stage = stage;
      this.nodes = JSON.stringify(nodes);
      this.clinician = user.toString();
      this.medical_case_id = medical_case_id.toString();
      this.mode = session.group.architecture;
      this.group_id = session.group.id.toString();
      this.mac_address = deviceInfo.mac_address;
      this.created_at = moment().toDate();
      this.synchronized_at = null;
    })();
  };
}

ActivityModel.schema = {
  name: 'Activity',
  primaryKey: 'id',
  properties: {
    id: 'string',
    stage: 'string',
    user: 'string',
    nodes: 'string',
    mode: 'string',
    group_id: 'string',
    mac_address: 'string',
    medical_case_id: 'string?',
    created_at: 'date',
    synchronized_at: 'date?',
  },
};
