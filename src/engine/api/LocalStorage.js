import { AsyncStorage } from 'react-native';
import moment from 'moment';
import remove from 'lodash/remove';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import maxBy from 'lodash/maxBy';

// TODO init localstorage, set initial value if undefined
export const setCredentials = async (newState) => {
  return await AsyncStorage.setItem('credentials', JSON.stringify(newState));
};

export const setItem = async (key, item) => {
  return await AsyncStorage.setItem(key, JSON.stringify(item));
};

export const getItems = async (key) => {
  const items = await AsyncStorage.getItem(key);

  const itemsArray = JSON.parse(items);

  if (itemsArray === null) {
    return [];
  }
  return itemsArray;
};

export const getItemFromArray = async (key, index, id) => {
  let items = await getItems(key);

  if (Array.isArray(items)) {
    let findItem = items.find((item) => {
      return item[index] === id;
    });

    return findItem;
  }
  return {};
};

export const destroyCredentials = async () => {
  return await AsyncStorage.removeItem('credentials', (err) => {
    // key 'key' will be removed, if they existed
    // callback to do some action after removal of item
  });
};

export const isLogged = async () => {
  let credentiels = await getCredentials();

  if (credentiels === null) {
    return false;
  }

  let date_expiry = new Date(credentiels.expiry * 1000);
  // TODO validate_token
  // if (!moment(date_expiry).isAfter(moment())) {
  //   return await get('auth/validate_token');
  // }

  return moment(date_expiry).isAfter(moment());
};

export const getCredentials = async (user_id) => {
  const credentials = await AsyncStorage.getItem('credentials');
  return JSON.parse(credentials);
};

export const getSessions = async () => {
  const sessions = await AsyncStorage.getItem('sessions');
  const sessionsArray = JSON.parse(sessions);
  if (sessionsArray === null) {
    return [];
  }
  return sessionsArray;
};

export const setMedicaleCase = async (medicalCase) => {
  let medicalCases = await getItems('medicalCases');

  if (Array.isArray(medicalCases)) {
    const idMedicalCase = findIndex(medicalCases, (item) => {
      return item.id === medicalCase.id;
    });
    medicalCases[idMedicalCase] = medicalCase;
    await setItem('medicalCases', medicalCases);
  }
};

export const getUserMedicaleCases = async (userId) => {
  let medicalCases = await getItems('medicalCases');
  let userMedicalCases = filter(medicalCases, (medicalCase) => {
    return medicalCase.userId === userId;
  });

  return userMedicalCases;
};

export const createMedicalCase = async (newMedicalCase) => {
  let medicalCases = await getItems('medicalCases');
  let maxId = maxBy(medicalCases, 'id');

  if (medicalCases.length === 0) {
    maxId = { id: 0 };
  }

  newMedicalCase.id = maxId.id + 1;
  newMedicalCase.createdDate = moment().format();
  medicalCases.push(newMedicalCase);

  return await setItem('medicalCases', medicalCases);
};
export const getMedicalCase = async (id) => {
  let medicalCases = await getItems('medicalCases');

  if (Array.isArray(medicalCases)) {
    let findMedicalCase = medicalCases.find((medicalCase) => {
      return medicalCase.id === id;
    });

    return findMedicalCase;
  }
  return {};
};

export const updateSession = async (id, newState) => {
  let sessions = await AsyncStorage.getItem('sessions');
  sessions = JSON.parse(sessions);

  if (Array.isArray(sessions)) {
    var index = findIndex(sessions, (session) => {
      return session.data.id === id;
    });

    sessions.splice(index, 1, newState);
  }
  await setSessions(sessions);
};

export const clearSessions = async () => {
  return await AsyncStorage.removeItem('sessions');
};

export const clearMedicalCases = async () => {
  return await AsyncStorage.removeItem('medicalCases');
};

export const SetActiveSession = async (id = null) => {
  const sessions = await getItems('sessions');
  await sessions.map((session) => {
    if (session.active === undefined || session.active === true) {
      session.active = false;
      session.active_since = false;
    }

    if (session.data.id === id) {
      session.active = true;
      session.active_since = moment().format();
    }
  });

  await setSessions(sessions);
};

export const getSession = async (id) => {
  let sessions = await AsyncStorage.getItem('sessions');
  sessions = JSON.parse(sessions);

  if (Array.isArray(sessions)) {
    let findSession = sessions.find((session) => {
      return session.data.id === id;
    });

    if (findSession === undefined) {
      return { access_token: 'unsecure' };
    }

    return findSession;
  }
  return {};
};

export const setSessions = async (newState) => {
  return await AsyncStorage.setItem('sessions', JSON.stringify(newState));
};

export const destroySession = async (session_id) => {
  let sessions = await AsyncStorage.getItem('sessions');
  sessions = JSON.parse(sessions);

  if (Array.isArray(sessions)) {
    remove(sessions, (session) => session.data.id === session_id);
  }
  await setSessions(sessions);
  return true;
};
