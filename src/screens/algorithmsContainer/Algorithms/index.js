import Algorithms from './Algorithms.screen';
import { withSessions } from 'engine/contexts/Sessions.context';
import { withApplication } from 'engine/contexts/Application.context';

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default withSessions(withApplication(Algorithms));
