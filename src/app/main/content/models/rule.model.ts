import { OptionValues } from './option.model';

export class Rules {
    id = -1;
    options;
    set_rule = "";
    change_by = "";
    value = "";

    constructor(rule?) {
        rule = rule || {};
        this.id = rule.id;
        this.set_rule = rule.set_rule;
        this.change_by = rule.change_by;
        this.value = rule.value;
        this.options = new Array<OptionValues>();
      }
  }