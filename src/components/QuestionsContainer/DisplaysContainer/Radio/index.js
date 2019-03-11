import Radio from './Radio';
import { connect } from 'react-redux';
import { setQuestion } from '../../../../../frontend_service/engine/actions/creators.actions';

const mapStateToProps = (medicalCase, ownProps) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setQuestion: (index, value) => dispatch(setQuestion(index, value)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radio);
