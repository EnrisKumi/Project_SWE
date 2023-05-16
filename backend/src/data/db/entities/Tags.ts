import { Entity } from "../../../packages";
import { EntityData, EntityInputData } from "../../../packages/entityInterfaces";

export interface TagsItem extends EntityData {
    text: string
}

export interface TagsData extends EntityInputData {
    id: string
}

export class Tags extends Entity {
    declare data: TagsData
    constructor(data: TagsData){
        super(data)
        this.entityType = 'Tags'
        this.key()
    }

    private key (): void {
        this.keys.PK = `Post#${this.data.id}`
        this.keys.SK = `Tags#${this.id}`
    }

}