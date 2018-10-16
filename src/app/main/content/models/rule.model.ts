import { OptionValues } from './option.model';

export class Rules {
    id = -1;
    options;
    set_rule = "";
    changed_by = "";
    value = "";

    constructor(rule?) {
        rule = rule || {};
        this.id = rule.id;
        this.set_rule = rule.set_rule;
        this.changed_by = rule.changed_by;
        this.value = rule.value;
        this.options = new Array<OptionValues>();
      }
  }