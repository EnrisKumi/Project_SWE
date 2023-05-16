import { DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { DeleteEntityOptions, EntityInputData, EntityKyes, GetEntityOptions, GetRangeKeysAndConditionByDatesInput, IndexNumber, QueryEntityOptions, SaveEntityOptions, UpdateEntityOptions } from './entityInterfaces'
import { ulid } from 'ulid'
import { TableNames } from '../../lib/utils/enums'
import { dynamoDBClient } from '../clients/AWS'

const tableName = TableNames.MAIN_TABLE

export class Entity {
  id: string
  entityType: string | undefined
  private readonly createdAt: string
  private readonly updatedAt: string
  keys: EntityKyes
  data: Record<string, any>
  tableName: string
  constructor (data: EntityInputData = {}) {
    this.id = data?.id ?? ulid()
    const date = new Date()
    this.createdAt = date.toISOString()
    this.updatedAt = date.toISOString()
    this.data = data
    this.keys = {}
    this.tableName = tableName
  }

  private logParams (options: any, params: object) {
    const logParams = options?.logParams || false
    if (logParams) {
      if (process.env.AWS_EXECUTION_ENV) {
        console.log('QUERY PARAMS', JSON.stringify(params))
      } else {
        console.dir({ params }, { depth: null })
      }
    }
  }

  private getRangeKeyWithoutSortingId (index?: IndexNumber, sk?: string | undefined) {
    if (sk) return sk
    const rangeKey = index ? this.keys[`GSI${index}SK`] : this.keys.SK
    if (!rangeKey) throw new Error('Could not get range key')
    const splitedKey = rangeKey.split('').reverse()
    let removedChar: string | undefined = ''
    do {
      removedChar = splitedKey.shift()
    } while (removedChar !== '#')
    return splitedKey.reverse().join('').concat('#')
  }

  private getRangeKeysAndConditionByDates (input: GetRangeKeysAndConditionByDatesInput) {
    let rKeyCondition = 'and begins_with(#rKey, :sk)'
    // let rKeyCondition = ''
    const {
      rangeKeyWithoutSortingId,
      dates: {
        beginTime,
        endTime
      } = {}
    } = input

    let rangeKeyByDatesValue: {
      ':sk'?: string
      ':skUpperBound'?: string
    } = {
      ':sk': rangeKeyWithoutSortingId
    }

    if (beginTime && endTime) {
      rangeKeyByDatesValue = {
        ':sk': `${rangeKeyWithoutSortingId}${ulid(beginTime.getTime())}`,
        ':skUpperBound': `${rangeKeyWithoutSortingId}${ulid(endTime.getTime())}`
      }
      rKeyCondition = 'and #rKey between :sk and :skUpperBound'
    } else if (beginTime) {
      rangeKeyByDatesValue = { ':sk': `${rangeKeyWithoutSortingId}${ulid(beginTime.getTime())}` }
      rKeyCondition = 'and #rKey >= :sk'
    } else if (endTime) {
      rangeKeyByDatesValue = { ':sk': `${rangeKeyWithoutSortingId}${ulid(endTime.getTime())}` }
      rKeyCondition = 'and #rKey <= :sk'
    }
    return { rangeKeyByDatesValue, rKeyCondition }
  }

  async save (options: SaveEntityOptions = {}): Promise<any> {
    const { tableName = this.tableName, allowOverRide = false, returnParams = false } = options
    const item = this.toItem()
    const params = {
      TableName: tableName,
      Item: item,
      ...(!allowOverRide) && { ConditionExpression: 'PK <> :pk AND SK <> :sk', ExpressionAttributeValues: { ':pk': this.keys.PK, ':sk': this.keys.SK } }
    }
    this.logParams(options, params)
    if (returnParams) return params
    await dynamoDBClient.send(new PutCommand(params))
    return item
  }

  async get (options: GetEntityOptions = {}) {
    const { tableName = this.tableName, index } = options
    if (!index) {
      const params = {
        TableName: tableName,
        Key: { PK: this.keys.PK, SK: this.keys.SK }
      }
      this.logParams(options, params)
      const response = await dynamoDBClient.send(new GetCommand(params))
      return response?.Item
    } else {
      const params = {
        TableName: tableName,
        IndexName: `GSI${index}`,
        KeyConditionExpression: '#hKey = :pk and #rKey = :sk',
        ExpressionAttributeValues: {
          ':pk': this.keys[`GSI${index}PK`],
          ':sk': this.keys[`GSI${index}SK`]
        },
        ExpressionAttributeNames: {
          '#hKey': `GSI${index}PK`,
          '#rKey': `GSI${index}SK`
        }
      }
      this.logParams(options, params)
      const response = await dynamoDBClient.send(new QueryCommand(params))
      const [item] = response.Items ?? []
      return item
    }
  }

  async query (options: QueryEntityOptions = {}) {
    const {
      tableName = this.tableName,
      index,
      filterexpression,
      expressionAttributeValues = {},
      scanIndexForward = false,
      nextToken,
      dates,
      limit = 20,
      sk
    } = options
    const { rangeKeyByDatesValue, rKeyCondition } = this.getRangeKeysAndConditionByDates({ rangeKeyWithoutSortingId: this.getRangeKeyWithoutSortingId(index, sk), dates })
    const params = {
      TableName: tableName,
      ...index && { IndexName: `GSI${index}` },
      ScanIndexForward: scanIndexForward,
      KeyConditionExpression: `#hKey = :pk ${rKeyCondition}`,
      ...filterexpression && { FilterExpression: filterexpression },
      ExpressionAttributeValues: {
        ':pk': index ? this.keys[`GSI${index}PK`] : this.keys.PK,
        ...rangeKeyByDatesValue,
        ...expressionAttributeValues
      },
      ExpressionAttributeNames: {
        '#hKey': index ? `GSI${index}PK` : 'PK',
        ...rangeKeyByDatesValue[':sk'] && { '#rKey': index ? `GSI${index}SK` : 'SK' }
      },
      Limit: limit,
      ...nextToken && { ExclusiveStartKey: decode(nextToken) }
    }
    this.logParams(options, params)
    const response = await dynamoDBClient.send(new QueryCommand(params))
    return {
      items: response?.Items,
      nextToken: encode(response?.LastEvaluatedKey)
    }
  }

  async delete (options: DeleteEntityOptions = {}) {
    const {
      tableName = this.tableName,
      returnParams = false
    } = options
    const params = {
      TableName: tableName,
      Key: {
        PK: this.keys.PK,
        SK: this.keys.SK
      }
    }
    if (returnParams) return params
    return await dynamoDBClient.send(new DeleteCommand(params))
  }

  async update (options: UpdateEntityOptions) {
    const {
      tableName = this.tableName,
      removePayload = [],
      returnParams = false,
      allowOverRide = false,
      expressionAttributeValues = {},
      condition
    } = options
    let conditionExpression = ''
    if (!allowOverRide) {
      conditionExpression = conditionExpression.concat('(PK = :pk AND SK = :sk)')
      if (condition) {
        conditionExpression = conditionExpression.concat(` AND (${condition})`)
      }
    } else {
      if (condition) conditionExpression = condition
    }
    const params = {
      TableName: tableName,
      Key: { PK: this.keys.PK, SK: this.keys.SK },
      ReturnValues: 'ALL_NEW',
      ...generateUpdateExpression(this.toUpdateItem(options), removePayload),
      ...conditionExpression && { ConditionExpression: conditionExpression }
    }
    params.ExpressionAttributeValues = {
      ...params.ExpressionAttributeValues,
      ...expressionAttributeValues,
      ...(!allowOverRide) && { ':pk': this.keys.PK, ':sk': this.keys.SK }
    }
    if (returnParams) return params
    this.logParams(options, params)
    return (await dynamoDBClient.send(new UpdateCommand(params))).Attributes
  }

  toUpdateItem (options: UpdateEntityOptions): object {
    // PK and SK can't be updated
    const { PK, SK, ...keys } = this.keys
    return {
      ...options.allowOverRide && { createdAt: this.createdAt, entityType: this.entityType },
      updatedAt: this.updatedAt,
      ...keys,
      ...this.data
    }
  }

  toItem (): object {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      entityType: this.entityType,
      ...this.keys,
      ...this.data
    }
  }
}

const encode = (item: any) => {
  if (!item) {
    return null
  }
  return Buffer.from(JSON.stringify(item)).toString('base64')
}

const decode = (item: string) => {
  return JSON.parse(Buffer.from(item, 'base64').toString())
}

const generateUpdateExpression = (updatePayload: Record<string, any>, removePayload: string[] = []) => {
  let UpdateExpression = 'SET '
  const ExpressionAttributeValues: Record<string, any> = {}
  const ExpressionAttributeNames: Record<string, any> = {}
  const keys: string[] = Object.keys(updatePayload)
  for (const key of keys) {
    if (!key.includes('.')) {
      UpdateExpression += `#${key}=:${key},`
      ExpressionAttributeValues[`:${key}`] = updatePayload[key]
      ExpressionAttributeNames[`#${key}`] = key
    } else {
      // used to support updating of a key on a map
      const keys = key.split('.')
      // eslint-disable-next-line array-callback-return
      keys.map(splitKey => {
        ExpressionAttributeNames[`#${splitKey}`] = splitKey
      })
      UpdateExpression += `#${keys.join('.#')}=:${trim(key)},`
      ExpressionAttributeValues[`:${trim(key)}`] = updatePayload[key]
    }
  }

  UpdateExpression = UpdateExpression.slice(0, -1)

  if (removePayload.length !== 0) {
    UpdateExpression += ' REMOVE '
    removePayload.map(removeKey => {
      UpdateExpression += `#${removeKey},`
      ExpressionAttributeNames[`#${removeKey}`] = removeKey
    })
    UpdateExpression = UpdateExpression.slice(0, -1)
  }

  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  }
}

// used to support updating of a key on a object
function trim (str: string) {
  return str.replace('.', '')
}
