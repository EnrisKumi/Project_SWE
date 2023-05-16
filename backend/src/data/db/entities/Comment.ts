import { Entity } from "../../../packages";
import { EntityData, EntityInputData } from "../../../packages/entityInterfaces";

export interface CommentItem extends EntityData {
    text: string
    username: string
}

export interface CommentData extends EntityInputData {
    id: string
}

export class Comment extends Entity {
    declare data: CommentData
    constructor(data: CommentData){
        super(data)
        this.entityType = 'Comment'
        this.key()
    }

    private key (): void {
        this.keys.PK = `Post#${this.data.id}`
        this.keys.SK = `Comment#${this.id}`
    }

}