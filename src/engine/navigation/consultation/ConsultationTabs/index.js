import TabsNavigation from './ConsultationTabs.navigation';
import { withSessions } from '../../../contexts/Sessions.context';
import { withApplication } from '../../../contexts/Application.context';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next/src/index';

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)( withSessions( withApplication( withNamespaces( ['Triage'] )( TabsNavigation ) ) ) );
