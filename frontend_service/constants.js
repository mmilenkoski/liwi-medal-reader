export const host = 'http://liwi.wavelab.top/api/v1/';
export const hostDataServer = 'https://liwi-main-data.herokuapp.com/api/';

export const navigationStateKey = 'navigationState';
export const alreadyLaunchedStateKey = 'alreadyLaunched';
export const appInBackgroundStateKey = 'appBackground';
// Hash used to encrypt local password
export const saltHash = 'x9gKs?RBf*96RK2DAM+&$CYv7A3Gjp=?X&RBLS%9KeL8Q3dSGjUzL_?2Vye3';

// Nodes types
export const nodesType = {
  diagnostic: 'diagnostic',
  finalDiagnostic: 'FinalDiagnostic',
  management: 'Management',
  questionsSequence: 'QuestionsSequence',
  question: 'Question',
  treatment: 'Treatment',
  healthCare: 'HealthCare',
};

// Display answer format
export const displayFormats = {
  radioButton: 'RadioButton',
  checkBox: 'CheckBox',
  input: 'Input',
  list: 'DropDownList',
  formula: 'Formula',
  reference: 'Reference',
  string: 'String',
  date: 'Date',
};

export const healthCareType = {
  pill: 'pill',
  liquid: 'liquid',
};

// Value of answer accepted
export const valueFormats = {
  array: 'Array',
  int: 'Integer',
  float: 'Float',
  bool: 'Boolean',
  string: 'String',
  date: 'Date',
};

// Stage of questions
export const stage = {
  registration: 'registration',
  triage: 'triage',
  test: 'test',
  consultation: 'consultation',
};

export const systems = {
  general: 'General',
  respiratory_circulation: 'Respiratory and circulatory system',
  ear_nose_mouth_throat: 'Ear, nose, mouth and throat system',
  visual: 'Visual system',
  integumentary: 'Integumentary system',
  digestive: 'Digestive system',
  urinary_reproductive: 'Urinary and reproductive system',
  nervous: 'Nervous system',
  muscular_skeletal: 'Muscular and skeletal system',
  null: 'General',
};

// Node category
export const categories = {
  assessment: 'assessment_test',
  chronicCondition: 'chronic_condition',
  vitalSignTriage: 'vital_sign_triage',
  emergencySign: 'emergency_sign',
  exposure: 'exposure',
  physicalExam: 'physical_exam',
  symptom: 'symptom',
  demographic: 'demographic',
  comorbidity: 'comorbidity',
  complaintCategory: 'complaint_category',
  predefinedSyndrome: 'predefined_syndrome',
  triage: 'triage',
  vaccine: 'vaccine',
  scored: 'scored',
  treatment: 'treatment',
  management: 'management',
  other: 'other',
  treatmentQuestion: 'treatment_question',
  backgroundCalculation: 'background_calculation',
  vitalSignConsultation: 'vital_sign_consultation',
  observedPhysicalSign: 'observed_physical_sign',
};

// Type of nodes received from json
export const typeNode = {
  question: 'Question',
  management: 'Management',
  questionsSequence: 'QuestionsSequence',
  treatment: 'Treatment',
};

// Status of medical cases
export const medicalCaseStatus = {
  waitingTriage: { name: 'waiting_triage', index: 0 },
  triage: { name: 'triage', index: 1 },
  waitingConsultation: { name: 'waiting_consultation', index: 2 },
  consultation: { name: 'consultation', index: 3 },
  waitingTest: { name: 'waiting_test', index: 4 },
  test: { name: 'test', index: 5 },
  waitingDiagnostic: { name: 'waiting_diagnostic', index: 6 },
  final_diagnostic: { name: 'final_diagnostic', index: 7 },
  close: { name: 'close', index: 8 },
};

export const routeDependingStatus = (medicalCase) => {
  let route;

  switch (medicalCase.status) {
    case medicalCaseStatus.waitingTriage.name:
    case medicalCaseStatus.triage.name:
    case medicalCaseStatus.waitingConsultation.name:
      route = 'Triage';
      break;
    case medicalCaseStatus.consultation.name:
    case medicalCaseStatus.waitingTest.name:
      route = 'Consultation';
      break;
    case medicalCaseStatus.test.name:
    case medicalCaseStatus.waitingDiagnostic.name:
      route = 'Tests';
      break;
    case medicalCaseStatus.final_diagnostic.name:
      route = 'DiagnosticsStrategy';
      break;
    case medicalCaseStatus.close.name:
      route = 'Summary';
      break;
  }

  return route;
};
