import { connect } from 'react-redux';
import Date from './Date';
import { setPatientValue, setAnswer } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setAnswer: (index, value) => dispatch(setAnswer(index, value)),
    setPatientValue: (index, value) => dispatch(setPatientValue(index, value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Date);
