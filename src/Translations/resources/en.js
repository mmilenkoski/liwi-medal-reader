export default {
  actions: {
    continue: 'Continue',
    login: 'Login',
    search: 'Search',
    select: 'Select',
    synchronize: 'Synchronize',
    clear_filters: 'Clear all filters',
    new_medical_case: 'New case',
  },
  algorithm: {
    version_id: 'Version id',
    version_name: 'Version name',
    json_version: 'Build version',
    updated_at: 'Last update',
  },
  application: {
    theme: {
      dark_mode: 'Dark mode',
      light_mode: 'Light mode',
    },
  },
  containers: {
    auth: {
      login: {
        title: 'Connect to medAL-creator',
        email: 'Email',
        password: 'Password',
        environment: 'Environment',
      },
      synchronization: {
        title: 'Synchronize with medAL-creator',
        description:
          'An administrator will assign this device to your health facility',
      },
      pin: {
        unlock: 'Enter the PIN to unlock the tablet',
        delete: 'Delete',
      },
    },
    filters: {
      title: 'Filters',
      patient_info: 'Patient information',
      others: 'Others',
    },
    home: {
      title: 'Latest consultations',
    },
    medical_case: {
      navigation: {
        back: 'Prev',
        next: 'Next',
        quit: 'Quit',
      },
      stages: {
        registration: 'Registration',
        first_assessments: '1st assessments',
        consultation: 'Consultation',
        assessments: 'Assessments',
        diagnoses: 'Diagnoses',
      },
      steps: {
        registration: 'Registration',
        unique_triage_questions: 'Unique triage questions',
        complaint_categories: 'Complaint categories',
        basic_measurements: 'Basic measurements',
        medical_history: 'Medical history',
        physical_exams: 'Physical exams',
        comment: 'Comment',
        assessments: 'Assessments',
        final_diagnoses: 'Final diagnoses',
        healthcare_questions: 'Healthcare questions',
        medicines: 'Medicines',
        formulations: 'Formulations',
        summary: 'Summary',
      },
    },
    scan: {
      scan: 'Scan the QR code',
      new: 'You need to generate a new sticker',
      new_sticker_notification:
        'You need to give another sticker to the patient',
      new_sticker_wrong_facility:
        'The new sticker does not belong to your facility',
    },
    patient: {
      list: {
        title: 'Patient list',
        name: 'Name',
        last_visit: 'Last visit',
        status: 'Status',
      },
      consultations: {
        current_consultation: 'Current consultation',
        last_consultations: 'Last consultations',
      },
      personal_info: {
        patient_info: 'Patient information',
        consultations_info: 'Consultations information',
      },
    },
    medicalCase: {
      list: {
        title: 'Consultations',
        name: 'Name',
        status: 'Status',
      },
    },
    synchronization: {
      synchronize: 'Synchronize',
      not_synchronized: 'Medical cases not synchronized yet',
    },
    settings: {
      general: {
        title: 'General',
        environment: 'Environment',
        app_languages: 'App languages',
        algorithm_languages: 'Algorithm languages',
      },
      algorithm: {
        title: 'Algorithm',
      },
      health_facility: {
        title: 'Health facility',
      },
      device: {
        title: 'Device',
      },
    },
  },
  components: {
    medical_case_drawer: {
      current_medical_case: 'Current consultation',
    },
    modal: {
      study: {
        no_content:
          'No content is available. Please fill the study description in medAL-creator',
      },
    },
  },
  device: {
    name: 'Name',
    mac_address: 'MAC address',
    model: 'Model',
    brand: 'Brand',
    os: 'OS',
    os_version: 'OS Version',
    name_not_available: 'no name available',
  },
  health_facility: {
    id: 'ID',
    name: 'Name',
    architecture: 'Architecture',
    country: 'Country',
    area: 'Area',
    local_data_ip: 'MedAL-hub address',
    main_data_ip: 'MedAL-data address',
    roles: {
      medical_doctor: 'Medical Doctor (MD)',
      assistant_medical_officer: 'Assistant Medical Officer (AMO)',
      clinical_officer: 'Clinical Officer (CO)',
      nurse: 'Nurse',
      midwife: 'Midwife',
      pharmacist: 'Pharmacist',
      registration_assistant: 'Registration assistant',
    },
  },
  navigation: {
    scan_qr_code: 'Scan QR code',
    consultations: 'Consultations',
    patient_list: 'Patient list',
    personal_info: 'Personal information',
    consent_files: 'Consent files',
    current_consultation: 'Current consultation',
    home: 'Home',
    synchronization: 'Synchronization',
    welcome: 'Welcome {{ clinician }}',
    settings: 'Settings',
    about: 'About',
    synchronize: 'Synchronize',
    logout: 'Logout',
  },
  permissions: {
    message: 'You must grant the relevant permissions for the app to function.',
    instructions:
      'Please go to Permissions in the tablet Settings and grant all required permissions',
  },
}
