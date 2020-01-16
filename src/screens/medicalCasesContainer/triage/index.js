import { connect } from 'react-redux';
import Triage from './Triage.Screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';
import { withPoliceOfficer } from '../../../engine/contexts/PoliceOfficer.context';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

export default connect(mapStateToProps)(withPoliceOfficer(withSessions(withApplication(WrapperNavigation(Triage)))));
