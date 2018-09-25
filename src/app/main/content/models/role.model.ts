import { Permission } from "./permission.model";

export class Role {
    id: number;
    name: string;
    permissions: Permission[];

    constructor(role?) {
        role = role || {};
        this.id = role.id || -1;
        this.name = role.name || '';
        this.permissions = new Array<Permission>();
    }
}