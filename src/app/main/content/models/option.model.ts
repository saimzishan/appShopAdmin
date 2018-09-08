export class Option {
    id: number;
    name = '';
    options: Array<OptionValues>;

    constructor(option?) {
        option = option || {};
        this.id = option.id;
        this.name = option.name || '';
        this.options = new Array<OptionValues>();
    }
}

export class OptionValues {
    id: number;
    value = '';
    option_set_id: number;

    constructor(optionvalues?) {
        optionvalues = optionvalues || {};
        this.id = optionvalues.id;
        this.value = optionvalues.value;
        this.option_set_id = optionvalues.option_set_id;
    }
}
