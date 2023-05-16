import { Entity } from "../../../packages";
import { EntityInputData } from "../../../packages/entityInterfaces";

export interface UserData extends EntityInputData  {
    id: string
}

export class User extends Entity {
    declare data: UserData
    constructor(data: UserData){
        super(data)
        this.entityType = 'User'
        this.key()
    }

    private key(): void {
        this.keys.PK = `User#${this.data.id}`
        this.keys.SK = `User#${this.data.id}`
    }
}