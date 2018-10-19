export class Option {
    id: number;
    name: string;
    options: Array<OptionValues>;

    constructor(option?) {
        option = option || {};
        this.id = option.id || -1;
        this.name = option.name || '';
        this.options = option.options || new Array<OptionValues>();
    }
}

export class OptionValues {
    id: number;
    value: string;

    constructor(optionValues?) {
        optionValues = optionValues || {};
        this.id = optionValues.id || -1;
        this.value = optionValues.value || '';
    }
}
