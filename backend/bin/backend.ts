#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { CognitoStack } from '../lib/stacks/cognitoStack';

const app = new App();

const cognitoStack = new CognitoStack(app, 'CognitoStack',{})