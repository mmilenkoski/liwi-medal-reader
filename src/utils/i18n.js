import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import { NativeModules } from 'react-native';

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: (callback) => {
    const deviceLocale = NativeModules.I18nManager.localeIdentifier;
    callback(deviceLocale);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        application: {
          loading: 'Loading...',
          no_data: 'No data available',
          date_format: 'DD/MM/YYYY',
          select: 'Select',
          save: 'Save',
          resource_not_available: 'No connection, resource not available',
          server_error: 'Server error',
        },
        consent_image: {
          scan: 'Scan consent',
          show: 'Show consent',
          title: 'Consent',
          label: 'Consent to data processing for this visit. NO if revoked',
          required: "The data processing consent can't be blank",
        },
        diagnoses: {
          add: 'Create',
          add_medicine: 'Additional Medicines',
          add_drugs: 'Add drugs',
          add_managements: 'Add management',
          additional_drugs: 'Drugs',
          additional_managements: 'Managements',
          additional: 'Do you want to add additional diagnoses not proposed?',
          agree: 'Agree',
          close: 'Close',
          custom: 'Do you want to manually add other diagnoses not proposed?',
          custom_duration: 'Custom duration',
          disagree: 'Disagree',
          duration: 'duration',
          list: 'List of diagnoses',
          manually_medicine: 'Medicines for the Additional Diagnoses',
          management: 'Management & Counselling',
          medicine: 'Medicine',
          medicines: 'Medicines',
          no_drugs: 'No drugs proposed',
          drugs: 'Drugs',
          managements: 'Managements',
          none: 'none',
          proposed: 'Diagnoses proposed by',
          no_proposed: 'No diagnoses proposed',
          search: 'Search by name',
          select: '  Please select...', // Keep the space at the begin of string
          sum: 'Summary Treatment',
          title_additional: 'Additional selected',
          no_additional: 'No additional diagnosis',
          no_additional_drugs: 'No additional drugs',
          no_additional_managements: 'No additional managements',
          no_medicines: 'No medicines available',
          no_managements: 'No managements available',
          weight: 'weight',
          which: 'Which formulation of medicine is available and appropriate for your patient?',
          write: 'Write the medicine',
          consultation_comment: 'You may add further clinical details for your records if you wish (Non-mandatory. Will not be used in the algorithm)'
        },
        drug: {
          give: 'Give',
          mg: 'mg',
          caps: 'capsule of',
          every: 'every',
          h: 'hours for',
          days: 'days',
          mode: 'Mode',
          tablet: 'tablet of',
          d: 'duration',
          during: 'during',
          admin: 'Administration',
          ml: 'ml',
          of: 'of',
          no_formulation: ' No formulation selected',
          missing_medicine_formulation: 'Please select a medicine formulation',
          no_options: 'No compatible option for this weight',
        },
        medication_form: {
          tablet: 'Tablet',
          capsul: 'Capsule',
          syrup: 'Syrup',
          suspension: 'Suspension',
          suppository: 'Suppository',
          drops: 'Drops',
          solution: 'Solution',
          powder_for_injection: 'Powder for injection',
          patch: 'Patch',
          cream: 'Cream',
          pessary: 'Pessary',
          ointment: 'Ointment',
          gel: 'Gel',
          spray: 'Spray',
          inhaler: 'Inhaler',
          per: 'per',
          per_administration: 'per administration',
        },
        media: {
          file_not_supported: 'File not supported',
          audio_error: 'An error occured with the audio file',
        },
        diagnoses_label: {
          additional: 'Additional',
          additionalDrugs: 'Additional drugs',
          custom: 'Custom',
          customDrugs: 'Custom drugs',
          proposed: 'Proposed',
        },
        modal: {
          invalidQuestions: 'Question(s) to fill',
          close: 'Close',
          notcomplete: 'Is not complete!',
          more: '...',
          uncompleted: 'Stage not valid',
          patientnotcomplete: 'The creation of the patient',
          is_required: 'is required',
          medicalCaseAlreadyUsed: 'Medical case not available',
        },
        algorithms: {
          never: 'Never synchronized data',
          last: 'Last synchronization attempt',
          success: 'Synchronization successful',
          nosuccess: 'The synchronization didn\'t work. ',
          titlesync: 'Synchronization status of consultations',
          synchronize: 'Synchronize cases',
          no: 'Never synchronized',
          need: 'Must be re-synchronized',
          uptdate: 'Synchronized',
        },
        confirm: {
          message: 'Do you want to close the current case and create new one?',
          new: 'Create new case',
          continue: 'Continue creating case',
        },
        emergency: {
          title: 'Emergency assistance',
          description: 'This page has been created to provide emergency assistance in case of need',
          description_warning: 'The patient is presenting a severe/emergency symptom or sign. Click on the emergency button if the child needs emergent care now',
          go_to_emergency: 'Go to emergency',
          back: 'Back to home',
        },
        qrcode: {
          scan: 'Scan the QR code',
          new: 'You need to generate a new sticker',
          open: 'Successful QR Code scanning. Opening Patient',
          new_sticker_notification: 'You need to give another sticker to the patient',
          new_sticker_wrong_facility: 'The new sticker does not belong to your facility',
        },
        summary: {
          diagnoses: 'Diagnoses',
          questions: 'Variables',
        },
        assessment: {
          title: 'First look assessment',
        },
        consultation: {
          medical_history: 'Medical history',
          physical_exam: 'Physical exam',
          comment: 'Comment',
        },
        triage: {
          unique_triage_questions: 'Unique triage questions',
          basic_measurement: 'Basic measurements',
          chronical_condition: 'Chronical conditions',
          other: 'Others',
          chief: 'Complaint categories',
          not_allowed: 'You have to answer all chief complaints',
        },
        form: {
          required: ' is required',
          save: 'Save',
          edit: 'Edit',
          back: 'Back',
          next: 'Next',
          next_stage: 'Next stage',
        },
        question: {
          yes: 'Yes',
          no: 'No',
          measured: 'Measured',
          estimated: 'Estimated',
          unavailable: 'Unavailable',
        },
        menu: {
          patientUpsert: 'Registration',
          triage: '1st assessment',
          unique_triage_questions: 'Unique triage questions',
          basic_measurements: 'Basic measurements',
          chronical_conditions: 'Chronical conditions',
          complaint_categories: 'Complaint categories',
          consultation: 'Consultation',
          medical_history: 'Medical history',
          physical_exam: 'Physical exam',
          consent_list: 'Consents file',
          comment: 'Comment',
          poct: 'POCT',
          tests: 'Tests',
          strategy: 'Diagnoses',
          search: 'Search a patient',
          add: 'Add a patient',
          others: 'Others',
          noredux: 'No consultation loaded',
        },
        comment: {
          save: 'Save comment',
          edit: 'Edit comment',
        },
        medical_case: {
          in_creation: 'Demographic',
          conditions: 'Conditions',
          medicines: 'Medicines',
          medicines_formulation: 'Medicine Formulations',
          final_diagnoses: 'Diagnoses',
          healthcares_questions: 'Management questions',
          healthcares: 'Treatments & Management',
          referral: 'Referral',
          managements: 'Managements',
          treatments: 'Treatments',
          waiting_triage: 'Waiting for 1st assessment',
          triage: '1st assessment',
          waiting_consultation: 'Waiting for consultation',
          consultation: 'Consultation',
          waiting_tests: 'Waiting for test',
          tests: 'Tests',
          waiting_diagnostic: 'Waiting for diagnostic',
          waiting_final_diagnostic: 'Wait for diagnosis',
          final_diagnostic: 'Diagnosis',
          close: 'Closed',
          finish: 'FINISH & CLOSE',
          next: 'NEXT',
          back: 'BACK',
        },
        settings: {
          devices: 'Medical devices',
          tests: 'Medical tests available',
          awake: 'Keep awake',
          production: 'Serveur de production',
          app: 'Application',
          version: 'Version',
          environment: 'Environment',
          generate_cases: 'Generate Medical Cases',
        },
        work_case: {
          create: 'New case',
          medical_case: 'Consultation',
          medical_cases: 'Consultations',
          no_medical_cases: 'No consultations',
          no_algorithm: 'No algorithm loaded',
          no_questions: 'No question for this category',
        },
        patient_detail: {},
        patient_list: {
          add: 'Add patient',
          all: 'All',
          waiting: 'Patients waiting for',
          search: 'Search',
          sort: 'Sort by',
          name: 'First name',
          surname: 'Last name',
          status: 'Status',
          no_patients: 'There is no patient',
          not_found: 'No match found',
          waiting_triage: '1st assessment',
          waiting_consultation: 'Consultation',
          waiting_test: 'Test',
          waiting_diagnostics: 'Diagnosis',
          case_in_progress: 'a case is open',
        },
        patient_summary_menu: {
          patient_profile: 'Patient profile',
          current_summary: 'Current summary',
          differential_diagnoses: 'Differential diagnoses',
        },
        patient_profile: {
          personal_information: 'Personal information',
          medical_cases: 'Consultations',
          date: 'Date',
          status: 'Status',
          add_case: 'Add consultation',
          edit_patient_value: 'Edit patient values',
        },
        patient_edit: {
          show_consent: 'Show consent file',
        },
        patient_upsert: {
          uid: 'UID',
          study_id: 'Study ID',
          group_id: 'Health Facility ID',
          other_uid: 'Other UID',
          other_study_id: 'Other study ID',
          other_group_id: 'Other HF ID',
          facility: 'Facility data',
          questions: 'Questions',
          title: 'Patient',
          save_and_wait: 'Save + add to waiting list',
          save_and_case: 'Save + create new case',
          save: 'Save',
        },
        medical_case_list: {
          all: 'All',
          waiting: 'Patients waiting for',
          search: 'Search',
          sort: 'Sort by',
          name: 'First name',
          surname: 'Last name',
          status: 'Status',
          no_medical_cases: 'There is no consultation in progress',
          not_found: 'No match found',
          waiting_triage: '1st assessment',
          waiting_consultation: 'Consultation',
          waiting_test: 'Test',
          waiting_diagnostic: 'Diagnosis',
        },
        patient: {
          first_name: 'First name *',
          last_name: 'Last name *',
          birth_date: 'Day of birth',
          gender: 'Gender *',
          male: 'Male',
          female: 'Female',
          age_not_defined: 'Age is not defined',
          reason: 'Reason for changing facility',
          days: 'Days',
          months: 'Months',
          year: 'Year *',
        },
        login: {
          title: 'Login',
          welcome: 'Welcome',
          add_account: 'Add an account',
          send_device_info: 'Send device data',
          clear_sessions: 'Delete sessions',
          error_char: 'At least 6 characters',
          error_letter: 'At least one letter and one number',
          email: 'Email',
          password: 'Password',
          connect: 'Login',
        },
        code_session_screen: {
          title: 'Welcome',
          your_code: 'Your code',
          set_code: 'Set code',
          type_your_code: 'Retype the code',
          error_char: 'Minimum 6 characters',
          error_same: 'The code must be the same',
          error_letter: 'At least one letter and one number',
        },
        basic_measurements: {
          temperature: 'Temperature',
          heart_rate: 'Heart rate',
          height: 'Height',
          weight: 'Weight',
          respiratory_rate: 'Respiratory rate',
        },
        new_session: {
          title: 'Connect to medAL-creator',
          unlock_session: 'Local login',
          connect: 'Login',
        },
        unlock_session: {
          who: 'Who are you?',
          fill: 'Fill the missing information as guest',
          pin: 'Enter the PIN to unlock the tablet',
          current_user: 'Currently logged in as',
          email: 'Email',
          assign: 'An administrator will assign this device to your health facility',
          code: 'Code',
          unlock: 'Login',
          title: 'Sync with medAL-creator',
          new_session: 'Create new session',
          sync_group: 'Synchronize',
          logout: 'logout',
          role: 'Role',
        },
        popup: {
          startSave: 'Save consultation',
          saveSuccess: 'Successfully saved',
          unlock: 'Force unlock',
          close: 'Close',
          desc: 'Description',
          version_name: 'version',
          version: 'Update of version',
          title: 'Please allow access to the position',
          message: 'Location sharing is necessary in order to use the medical service',
          ask_me_later: 'Ask me later',
          cancel: 'cancel',
          ok: 'Ok',
          by: 'by',
          summary: 'Summary',
          isLocked: 'Case is locked',
          at: 'at',
        },
        sessions: {
          active: 'Sessions active',
          empty: 'No session',
        },
        home: {
          title: 'Home',
        },
        navigation: {
          medical_case_list: 'Consultations',
          home: 'Home',
          triage: '1st assessment',
          patient_upsert: 'Patient',
          patient_edit: 'Patient edit',
          patient_list: 'Patient list',
          patient_search: 'Search a patient',
          patient_profile: 'Patient profile',
          synchronize: 'Synchronize',
          patient_add: 'New patient',
          patient_qr: 'Scan QR code',
          settings: 'Settings',
          my_profile: 'My profile',
          logout: 'Logout',
          synchronization: 'Synchronization',
          emergency: 'Emergency',
          diagnosticsstrategy: 'Diagnoses',
          conditions: 'Treatment Conditions',
          filter: 'Filters',
          step_invalid: 'Step is not valid',
          about: 'About',
          consent_list: "Facility's consent files",
        },
        common: {
          back: 'Back',
          disconnect: 'Disconnect',
          consultation: 'Consultation',
          patient_data: 'Patient',
        },
        filters: {
          title: 'Filters',
          clear: 'Clear all',
          apply: 'Apply',
          status: 'Status',
        },
        notifications: {
          empty_code: 'Your code is empty, please write it',
          invalid_code: ' Your local code is invalid, please try again',
          session_does_not_exist: 'Your local user does not exist, please try again',
          session_already_exist: 'Session already exists',
          no_internet: "You don't have internet connection",
          connection_successful: 'Connection successful',
          algorithm_updated: 'Your algorithm has been updated',
          get_group: 'Receiving group data and medical staff',
          device_registered: 'Device registered',
        },
        synchronize: {
          title: 'Consultations to synchronize',
          synchronize: 'Synchronize',
          not_warning: 'Medical cases have not been synchronised for more than 1 week',
          main_data_address_missing: 'Main data URL is missing in health facility configuration',
          error: 'An error occurred on Main Data server',
        },
      },
      fr: {
        summary: {
          title: 'Résumé actuel',
          diagnoses: 'Diagnosis',
        },
        notifications: {
          empty_code: "Votre code est vide, veuillez l'écrire",
          invalid_code: "Votre code local n'est pas valide, veuillez réessayer.",
          session_does_not_exist: "Cet utilisateur local n'existe pas, veuillez réessayer.",
          session_already_exist: 'La session existe déjà',
          no_internet: "Vous n'avez pas de connexion internet",
        },
        consultation: {
          medical_history: 'Medical History',
          physical_exam: 'Physical Exam',
          poct: 'Poct',
        },
        triage: {
          assessment: 'First look Assessments',
          basic_measurement: 'Basic measurments',
          comorbidities: 'Comorbidities',
          vaccination: 'Vaccination history',
          chief: 'Complaint Categories',
        },
        settings: {
          devices: 'Appareils médicaux',
          tests: 'Tests Médicaux disponible',
          app: 'Application',
          awake: 'Empécher la mise en veille',
          generate_cases: 'Générer des cas médicaux',
        },
        work_case: {
          create: 'Nouveau cas médical',
          medical_case: 'Cas médical',
          medical_cases: 'Cas médicaux',
          no_medical_cases: 'Aucun cans médicaux',
          no_algorithm: 'Aucun algorithme',
        },
        patient_detail: {},
        patient_list: {
          waiting: 'En attente',
          search: 'Rechercher',
          sort: 'Trier par',
          name: 'Nom',
          status: 'Status',
          no_patients: 'Aucun patients',
          not_found: 'Aucun résultat',
        },
        login: {
          server: 'server',
          local: 'local',
          your_code: 'Votre code',
          welcome: 'Bienvenue',
          set_code: 'Définir ce code',
          type_your_code: 'Retaper votre code',
          error_char: 'Minimum 6 caractères',
          error_same: 'Le code doit être le même',
          error_letter: 'Au moins une lettre et un chiffre',
          add_account: 'Ajouter un compte',
          send_device_info: 'Envoyer les infos du mobile',
          clear_sessions: 'Vider les sessions',
          password: 'Mot de passe',
          login: 'Connecter',
        },
        medical_case: {
          in_creation: 'In creation',
          managements: 'Managements',
          treatments: 'Treatments',
          final_diagnoses: 'Final diagnoses',
          healthcares_questions: 'Management questions',
          healthcares: 'Management',
          healthcares_no_weight: 'No weight has been renseigned',
          waiting_triage: 'Waiting for triage',
          triage: 'Triage',
          waiting_consultation: 'Waiting for consultation',
          waiting_tests: 'Waiting for tests',
          consultation: 'Consultation',
          waiting_test: 'Waiting for test',
          test: 'Test',
          waiting_diagnostic: 'Waiting for diagnostic',
          final_diagnostic: 'Diagnosis',
          close: 'Close',
        },
        unlock_session: {
          code: 'Code',
          unlock: 'Unlock',
        },
        popup: {
          title: "Merci d'autoriser l'accès à la position",
          message: 'Le partage de localisation est obligatoire afin de pouvoir utiliser le service médical',
          ask_me_later: 'Demandez moi plus tard',
          cancel: 'annuler',
        },
        sessions: {
          active: 'Sessions active',
          empty: 'Aucune session',
        },
        navigation: {
          patient_update: 'Patient Update',
          patient_list: 'Liste des patients',
          settings: 'Paramètres',
          available_algorithms: 'Algorithmes disponibles',
          triage: 'Triage',
        },
        common: {
          back: 'Retour',
          disconnect: 'Déconnecter',
          consultation: 'Consultation',
          patient_data: 'Données patient',
        },
      },
    },
    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },
  });

export default i18n;
