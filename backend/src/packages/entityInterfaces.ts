export interface EntityKyes {
    PK?: string
    SK?: string
    GSI1PK?: string
    GSI1SK?: string
    GSI2PK?: string
    GSI2SK?: string
    GSI3PK?: string
    GSI3SK?: string
    GSI4PK?: string
    GSI4SK?: string
    GSI5PK?: string
    GSI5SK?: string
    GSI6PK?: string
    GSI6SK?: string
    GSI7PK?: string
    GSI7SK?: string
    GSI8PK?: string
    GSI8SK?: string
    GSI9PK?: string
    GSI9SK?: string
    GSI10PK?: string
    GSI10SK?: string
  }
  
  export type IndexNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  
  export interface EntityInputData {
    id?: string
    [key: string]: any
  }
  
  export interface EntityData {
    id: string
    entityType: string
    PK: string
    SK: string
    createdAt: string
    updatedAt: string
    [key: string]: any
  }
  
  export interface EntityDefaultInputs {
    logParams?: boolean
    tableName?: string
  }
  
  export interface GetEntityOptions extends EntityDefaultInputs {
    index?: IndexNumber
  }
  
  export interface SaveEntityOptions extends EntityDefaultInputs {
    returnParams?: boolean
    allowOverRide?: boolean
  }
  
  export interface DeleteEntityOptions extends EntityDefaultInputs {
    returnParams?: boolean
  }
  
  export interface UpdateEntityOptions extends EntityDefaultInputs {
    expressionAttributeValues?: Record<string, any>
    returnParams?: boolean
    condition?: string
    allowOverRide?: boolean
    removePayload?: string[]
  }
  
  export interface QueryEntityOptions extends EntityDefaultInputs {
    index?: IndexNumber
    sk?: string
    filterexpression?: string
    expressionAttributeValues?: Record<string, any>
    dates?: {
      endTime?: Date
      beginTime?: Date
    }
    nextToken?: string
    limit?: number
    scanIndexForward?: boolean
  }
  
  export interface GetRangeKeysAndConditionByDatesInput {
    rangeKeyWithoutSortingId: string
    dates?: {
      endTime?: Date
      beginTime?: Date
    }
  }
  