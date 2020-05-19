import uuid from 'react-native-uuid';

import { ActivityModel } from '../../../../frontend_service/engine/models/Activity.model';
import { PatientValueModel } from '../../../../frontend_service/engine/models/PatientValue.model';
import { PatientModel } from '../../../../frontend_service/engine/models/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/engine/models/MedicalCase.model';
import { getItem } from '../LocalStorage';
import { elementPerPage } from '../../../utils/constants';


const Realm = require('realm');

export default class RealmInterface {
  /**
   * Generates and returns a realm database object
   * @returns { Realm } - A realm database object
   * @private
   */
  _realm = () => {
    const key = new Int8Array(64); // pupulate with a secure key

    return new Realm({
      schema: [PatientValueModel,PatientModel, MedicalCaseModel, ActivityModel],
      deleteRealmIfMigrationNeeded: true,
      encryptionKey: key,
    });
  };

  delete = (object) => {
    this._realm().write(() => {
      realm.delete(object);
    });
  };

  /**
   * Finds a object based on a field and a value
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } value - The id of the object we want
   * @param { string } field - The field we wanna search for
   * @returns { Collection } - The wanted object
   */
  findBy = (model, value, field = 'id') => {
    const object = this._realm().objects(model).filtered(`${field} = $0`, value)[0];
    return object === undefined ? null : object;
  };

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Used for pagination,tells what page to show
   * @returns { Collection } - A collection of all the data
   */
  getAll = (model, page = null) => {
    if (page === null) {
      return this._realm().objects(model);
    } else {
      return this._realm()
        .objects(model)
        .slice((page - 1) * elementPerPage, elementPerPage * page);
    }
  };

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  insert = async (model, object) => {
    const session = await getItem('session');
    if (session.group.architecture === 'client_server') object = { ...object, fail_safe: true };

    this._realm().write(() => {
      this._realm().create(model, object);
    });
    this._savePatientValue(model, object);
  };

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @returns { Collection } - Updated object
   */
  update = async (model, id, fields) => {
    const session = await getItem('session');
    if (session.group.architecture === 'client_server') {
      fields = { ...fields, fail_safe: true };
    }
    this._realm().write(() => {
      this._realm().create(model, { id, ...fields }, 'modified');
    });
  };

  /**
   * Blank method used in httpInterface
   */
  unlockMedicalCase = () => {
  };

  lockMedicalCase = () => {
  };

  /**
   * Push an object in a existing object based on model name and id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } field - The field to update
   * @param { any } value - value to update
   * @returns { Collection } - Updated object
   */
  push = async (model, id, field, value) => {
    const session = await getItem('session');
    const object = await this.findBy(model, id);
    if (session.group.architecture === 'client_server') {
      value = { ...value, fail_safe: true };
    }
    this._realm().write(() => {
      object[field].push(value);
    });
  };

  where = async (model, value, field) => {
    return this._realm().objects(model).filtered(`${field} = $0`, value);
  };

  _getMedicalCaseFromModel = (model, object) => {
    switch (model) {
      case 'MedicalCase':
        return object;
      case 'Patient':
        return object.medicalCases[object.medicalCases.length - 1];
      default:
        console.error('Wrong model :', model, object);
    }
  };

  _savePatientValue = (model, object) => {
    const medicalCase = this._getMedicalCaseFromModel(model, object);

    const activities = JSON.parse(medicalCase.activities[medicalCase.activities.length - 1].nodes);

    activities.map((node) => {
      if (['category', 'basic_demographic'].includes(medicalCase.nodes[node.id].category)) {
        const patientValue = {
          id: uuid.v4(),
          value: node.value,
          node_id: parseInt(node.id),
          answer_id: parseInt(node.answer),
          patient_id: medicalCase.patient_id,
        };

        this._realm().write(() => {
          this._realm().create('PatientValue', patientValue, 'modified');
        });
      }
    });
  };
}
