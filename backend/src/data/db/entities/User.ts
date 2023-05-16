import { Entity } from "../../../packages";
import { EntityData, EntityInputData } from "../../../packages/entityInterfaces";

export interface UserItem extends EntityData { 
    location: string,
    bio: string
}

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