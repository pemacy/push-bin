import { Client } from 'pg'
import fs from 'fs';
import getSecret from '../awsSecretsManager';

export const awsSecretsManager = async () => {
  const dbType = 'postgres'
  const response = await getSecret(dbType)

  const secret = response.SecretString
  const { user, password } = JSON.parse(secret!);
  const encodedPassword = encodeURIComponent(password)

  console.log("POSTGRES SECRET STRING:", response.SecretString)
  console.log('Encoded Password', encodedPassword)

  const config = { user, password }
  const client = await ssl(config)
  return client
}

export const ssl = async (options = {}) => {
  const caFilePath = process.env.CA_FILE_PATH
  if (!caFilePath) throw new Error('CA_FILE_PATH undefined')
  const ca = fs.readFileSync(caFilePath).toString()
  const sslConfig = {
    ssl: {
      rejectUnauthorized: false,
      ca
    }
  }

  const config = { ...sslConfig, ...options }

  const client = await standard(config)
  return client
}

export const standard = async (options = {}) => {
  const user = process.env.PGUSER
  const password = process.env.PGPASSWORD
  const host = process.env.PGHOST
  const port = parseInt(process.env.PGPORT!, 10)
  const database = process.env.PGDATABASE

  if (!host || !port || !user || !password || !database) {
    console.log("Protocol or Host or Port or User or Password or Database is undefined")

    console.log("endpoint:", host)
    console.log("port:", port)
    console.log("user:", user)
    console.log("pass:", password)
    console.log("dbName:", database)

    throw new Error('One or more Mongo env variables are undefined')
  }

  const standardConfig = { user, password, host, port, database }

  const config = { ...standardConfig, ...options }

  const client = new Client(config)

  try {
    await client.connect()
    console.log("Postgres Database Connected:", client.database)
    return client
  } catch (err) {
    console.log('Postgres connection error occured:', err)
  }
}
