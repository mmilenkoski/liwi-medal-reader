import Navigation from './Navigation'
export const Config = {
  ALGORITHM_INFO: ['version_name', 'version_id', 'updated_at'],
  CATEGORIES: {
    assessment: 'assessment_test',
    chronicCondition: 'chronic_condition',
    basicMeasurement: 'basic_measurement',
    basicDemographic: 'basic_demographic',
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
    drug: 'drug',
    management: 'management',
    treatmentQuestion: 'treatment_question',
    backgroundCalculation: 'background_calculation',
    vitalSignAnthropometric: 'vital_sign_anthropometric',
    observedPhysicalSign: 'observed_physical_sign',
    consultationRelated: 'consultation_related',
    uniqueTriagePhysicalSign: 'unique_triage_physical_sign',
    uniqueTriageQuestion: 'unique_triage_question',
    referral: 'referral',
  },
  VALUE_FORMATS: {
    array: 'Array',
    int: 'Integer',
    float: 'Float',
    bool: 'Boolean',
    string: 'String',
    date: 'Date',
    present: 'Present',
    positive: 'Positive',
  },
  DEVICE_INFO: ['mac_address', 'name', 'model', 'brand'],
  DATABASE_INTERFACE: {
    local: 'local',
    remote: 'remote',
  },
  DISPLAY_FORMAT: {
    radioButton: 'RadioButton',
    input: 'Input',
    dropDownList: 'DropDownList',
    formula: 'Formula',
    reference: 'Reference', // table reference
    string: 'String',
    autocomplete: 'Autocomplete',
    date: 'Date',
  },
  ELEMENT_PER_PAGE: 15,
  ENVIRONMENTS: [
    { label: 'Test', value: 'test' },
    { label: 'Staging', value: 'staging' },
    { label: 'Production', value: 'production' },
  ],
  HEALTH_FACILITY_INFO: [
    'id',
    'architecture',
    'area',
    'country',
    'name',
    'main_data_ip',
    'local_data_ip',
  ],
  LANGUAGES: [
    { label: 'English', value: 'en' },
    { label: 'Swahili', value: 'sw' },
    { label: 'Français', value: 'fr' },
  ],
  MEDICAL_CASE_STATUS: {
    inCreation: { label: 'in_creation' },
    triage: { label: 'triage' },
    consultation: { label: 'consultation' },
    tests: { label: 'tests' },
    finalDiagnostic: { label: 'final_diagnostic' },
    close: { label: 'close' },
  },
  NODE_TYPES: {
    diagnosis: 'Diagnosis',
    finalDiagnostic: 'FinalDiagnostic',
    healthCare: 'HealthCare',
    question: 'Question',
    questionsSequence: 'QuestionsSequence',
  },
  PING_INTERVAL: 5000,
  URL_PRODUCTION_API: 'https://medalc.unisante.ch//api/v1',
  URL_STAGING_API: 'https://liwi.wavelab.top/api/v1/',
  URL_TEST_API: 'https://liwi-test.wavelab.top/api/v1/',
  NAVIGATION: Navigation,
  MOVIES_EXTENSION: ['mp4', 'mov', 'avi'],
  AUDIOS_EXTENSION: ['mp3', 'ogg'],
  PICTURES_EXTENSION: ['jpg', 'jpeg', 'gif', 'png', 'tiff'],
}
