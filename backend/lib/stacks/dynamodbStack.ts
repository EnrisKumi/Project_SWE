import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, StreamViewType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";


export interface DynamoDBStackProps extends StackProps {

}

export class DynamoDBStack extends Stack {
    mainTable: Table
    constructor(scope: Construct, id: string, props: DynamoDBStackProps){
        super(scope, id, props)

        const mainTable = new Table(this, 'MainTable', {
            tableName: 'MainTable',
            partitionKey: {
                name: 'PK',
                type: AttributeType.STRING
            },
            sortKey: {
                name: 'SK',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            stream: StreamViewType.NEW_AND_OLD_IMAGES,
            timeToLiveAttribute: 'ttl'
        })

        // mainTable.addGlobalSecondaryIndex({
        //     partitionKey: {
        //         name: 'PK',
        //         type: AttributeType.STRING
        //     },
        //     indexName: 'Post'
        // })

        this.mainTable = mainTable
    }
}