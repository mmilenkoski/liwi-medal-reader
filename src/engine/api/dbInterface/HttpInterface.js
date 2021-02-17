import fetch from '../../../utils/fetchWithTimeout';

import { getItem } from '../LocalStorage';
import { handleHttpError } from '../../../utils/CustomToast';
import { getDeviceInformation } from '../Device';
import { PatientModel } from '../../../../frontend_service/helpers/Patient.model';
import { MedicalCaseModel } from '../../../../frontend_service/helpers/MedicalCase.model';

export default class HttpInterface {
  constructor() {
    return (async () => {
      const session = await getItem('session');
      const deviceInfo = await getDeviceInformation();
      this.localDataIp = session.facility.local_data_ip;
      this.macAddress = deviceInfo.mac_address;
      await this._setClinician();
      return this;
    })();
  }

  /**
   * Creates an entry of a specific model in the database
   * @param { string } model - The model name of the data we want to retrieve
   * @param { object } object - The value of the object
   */
  insert = async (model, object) => {
    const url = `${this.localDataIp}/api/${this._mapModelToRoute(model)}`;
    const header = await this._setHeaders('POST', object);
    return this._fetch(url, header);
  };

  /**
   * Returns the entry of a specific model with an id
   * @param { string } model - The model name of the data we want to retrieve
   * @param { string } value - Value to find in database row
   * @param { string } field - database column
   * @returns { Collection } - The wanted object
   */
  findBy = async (model, value, field) => {
    const url = `${this.localDataIp}/api/${this._mapModelToRoute(model)}/find_by?field=${field}&value=${value}`;
    const header = await this._setHeaders();
    const data = await this._fetch(url, header);
    if (data !== null) {
      return this._initClasses(data, model);
    }
    return data;
  };

  /**
   * Returns all the entry on a specific model
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } page - Pagination. if null, retrieved all information
   * @param { object } params - options for the request the search query and the filter is in there
   * @returns { Collection } - A collection of all the data
   */
  getAll = async (model, page, params) => {
    const stringFilters = this._generateFiltersUrl(params.filters);
    const url = `${this.localDataIp}/api/${this._mapModelToRoute(model)}?page=${page}&query=${params.query}${stringFilters !== '' ? `&filter=${stringFilters}` : ''}`;
    const header = await this._setHeaders();
    return this._fetch(url, header);
  };

  /**
   * Update or insert value in a existing row
   * @param { string } model - The model name of the data we want to retrieve
   * @param { integer } id - The row to update
   * @param { string } fields - The field to update
   * @param { boolean } updatePatientValue - Used only in RealmInterface
   * @returns { Collection } - Updated object
   */
  update = async (model, id, fields, updatePatientValue) => {
    const url = `${this.localDataIp}/api/${this._mapModelToRoute(model)}/${id}`;
    const header = await this._setHeaders('PUT', fields);

    return this._fetch(url, header);
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
    const url = `${this.localDataIp}/api/${this._mapModelToRoute(model)}/${id}`;
    const header = await this._setHeaders('PUT', { [field]: value });
    return this._fetch(url, header);
  };

  /**
   * Unlock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  unlockMedicalCase = async (id) => {
    const url = `${this.localDataIp}/api/medical_cases/${id}/unlock`;
    const header = await this._setHeaders();
    return this._fetch(url, header);
  };

  /**
   * lock a medical case when device is in client server architecture
   * @param {integer} id - Medical case id
   * @returns {string}
   */
  lockMedicalCase = async (id) => {
    const url = `${this.localDataIp}/api/medical_cases/${id}/lock`;
    const header = await this._setHeaders();
    return this._fetch(url, header);
  };

  /**
   * Synchronize patients and medical cases with local data
   * @param patients
   * @returns {Promise<string|Array>}
   */
  synchronizePatients = async (patients) => {
    const url = `${this.localDataIp}/api/patients/synchronize`;
    const header = await this._setHeaders('POST', { patients });
    return this._fetch(url, header);
  };

  /**
   * Get all consent file for all users
   * @returns {Promise<string|Array>}
   */
  getConsentsFile = async (page) => {
    const url = `${this.localDataIp}/api/patients/consents_file?page=${page}`;
    const header = await this._setHeaders();
    return this._fetch(url, header);
  };

  /**
   * Make the request and parse result
   * @param { string } url - Url to bind
   * @param { object } header - Header options
   * @returns {Promise<string|array>}
   * @private
   */
  _fetch = async (url, header) => {
    const httpRequest = await fetch(url, header).catch((error) => {
      handleHttpError(error);
    });

    // In case of fetch timeout
    if (httpRequest !== undefined) {
      const result = await httpRequest.json();
      if (httpRequest.status === 200) {
        return result;
      }
      if (httpRequest.status > 404) {
        handleHttpError(result.message);
      }
    }

    return null;
  };

  /**
   * Map model to local data route
   * @param { string } model - The model name of the data we want to retrieve
   * @returns { string } - local data route
   * @private
   */
  _mapModelToRoute = (model) => {
    let route = '';

    switch (model) {
      case 'Patient':
        route = 'patients';
        break;
      case 'MedicalCase':
        route = 'medical_cases';
        break;
      default:
        console.warn('route doesn\'t exist', model);
    }

    return route;
  };

  /**
   * Set header credentials to communicate with server
   * @params [String] method
   * @params [Object] body
   * @return [Object] header
   * @private
   */
  _setHeaders = async (method = 'GET', body = false) => {
    if (this.clinician === null) {
      await this._setClinician();
    }

    const header = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-mac-address': this.macAddress,
        'x-clinician': this.clinician,
      },
    };

    if (method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE') {
      header.body = JSON.stringify(body);
    }

    return header;
  };

  /**
   * Set value of clinician with params from local storage
   * Due to missing user info on tablet initialization
   * @returns {Promise<void>}
   * @private
   */
  _setClinician = async () => {
    const user = await getItem('user');
    this.clinician = user ? `${user.first_name} ${user.last_name}` : null;
  };

  /**
   * Generate an URL with filters object
   * @param {object} filters - Filter object with key and value
   * @returns {string}
   * @private
   */
  _generateFiltersUrl = (filters) => {
    let stringFilters = '';

    if (filters.length !== 0) {
      Object.keys(filters).forEach((nodeId, key) => {
        stringFilters += `${nodeId}:`;
        filters[nodeId].map((filter, filterKey) => {
          stringFilters += filter;
          if (filterKey + 1 < filters[nodeId].length) {
            stringFilters += ',';
          }
        });
        if (key + 1 < Object.keys(filters).length) {
          stringFilters += '|';
        }
      });
    }

    return stringFilters;
  };

  /**
   * Generate class
   * @param { array|object } data - Data retrieved from server
   * @param { string } model - Class name
   * @returns {Promise<[]|PatientModel|MedicalCaseModel>}
   * @private
   */
  _initClasses = async (data, model) => {
    const object = [];
    const environment = await getItem('environment');

    if (model === 'Patient') {
      if (data instanceof Array) {
        data.forEach((item) => {
          object.push(new PatientModel(item, environment));
        });
      } else {
        return new PatientModel(data, environment);
      }
    } else if (data instanceof Array) {
      data.forEach((item) => {
        object.push(new MedicalCaseModel(item));
      });
    } else {
      return new MedicalCaseModel(data);
    }
    return object;
  };
}
