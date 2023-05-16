import { Entity } from "../../../packages"
import { EntityData, EntityInputData } from "../../../packages/entityInterfaces"


export interface PostItem extends EntityData {
  Username: string
  Description: string
  Status: string
  Tags: string
  Date: string
  StartTime: string
  Limit: string
  Location: string
}

export interface PostData extends EntityInputData {
  sub?: string
  username?: string
}

export class Post extends Entity {
  declare data: PostData
  constructor (data: PostData) {
    super(data)
    this.entityType = 'Post'
    this.key()
  }

  private key (): void {
    this.keys.PK = 'Post'
    this.keys.SK = `Post#${this.data.username}`
  }
}
