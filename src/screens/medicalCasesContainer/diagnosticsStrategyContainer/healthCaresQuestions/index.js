import { connect } from "react-redux";
import HealthCaresQuestions from "./HealthCaresQuestions.screen";
import { withApplication } from "../../../../engine/contexts/Application.context";
import { WrapperNavigation } from "../../../../utils/WrapperNavigation";

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

export default connect(mapStateToProps)(withApplication(WrapperNavigation(HealthCaresQuestions)));
