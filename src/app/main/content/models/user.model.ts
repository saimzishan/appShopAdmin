import { Role } from "./role.model";

export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    level: string;
    provider: string;
    roles: Role[] | any;

    constructor(user?) {
        user = user || {};
        this.id = user.id || -1;
        this.name = user.name || '';
        this.email = user.email || '';
        this.password = user.password || '';
        this.level = user.level || '';
        this.provider = user.provider || '';
        this.roles = user.roles || new Array<User>();
    }
}