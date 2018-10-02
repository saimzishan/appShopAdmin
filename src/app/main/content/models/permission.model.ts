export class Permission {
    id: number;
    name: string;

    constructor(permission?) {
        permission = permission || {};
        this.id = permission.id || -1;
        this.name = permission.name || '';
    }
}