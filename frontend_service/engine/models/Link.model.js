// @flow

import { InclusionsNodeModel } from './InclusionsNode.model';
import { RequirementNodeModel } from './RequirementNodeModel';

interface LinkNodeInterface {}

export class LinkNodeModel implements LinkNodeInterface {
  constructor(props) {
    const { children, conditions, id, top_conditions } = props;

    this.requirement = new RequirementNodeModel({ conditions, top_conditions });

    this.conditons = conditions;
    this.top_conditions = top_conditions;
    this.id = id;
    this.children = children;
  }
}
