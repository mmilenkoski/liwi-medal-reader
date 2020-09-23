import { connect } from 'react-redux';
import QuestionFactory from './Question.factory';
import { withApplication } from '../../../engine/contexts/Application.context';
import { updateModalFromRedux } from '../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(QuestionFactory));
