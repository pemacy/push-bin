import mongoose from 'mongoose'
import getSecret from '../awsSecretsManager'

type Config = {
  [key: string]: any;
  config?: Record<string, any>;
};

export const standard = async (options: Config = {}) => {
  try {
    const protocol = options.protocol || process.env.MONGO_PROTOCOL
    const endpoint = options.endpoint || process.env.MONGO_ENDPOINT
    const port = options.port || process.env.MONGO_PORT
    const user = options.user || process.env.MONGO_USER
    const dbName = options.dbName || process.env.MONGO_DATABASE

    if (!protocol || !endpoint || !port || !user || !dbName) {
      console.log("Protocol or Endpoint or Port or User or Pass or dbName is undefined")

      console.log("protocol:", protocol)
      console.log("endpoint:", endpoint)
      console.log("port:", port)
      console.log("user:", user)
      console.log("dbName:", dbName)

      throw new Error('One or more Mongo env variables are undefined')
    }

    let pass
    if (options.pass) {
      pass = options.pass
    } else {
      if (!process.env.MONGO_PASSWORD) throw new Error("MONGO_PASSWORD not set")
      pass = encodeURIComponent(process.env.MONGO_PASSWORD)
    }

    options.config = options.config || {}

    const url = `${protocol}://${user}:${pass}@${endpoint}:${port}/${dbName}`
    console.log("MONGO URL", url)
    await mongoose.connect(url, options.config)
    console.log("==== Mongo Database connected")
  } catch (err) {
    console.log('MongoDB connection error:', err)
    process.exit(1)
  }
}

export const ssl = async (options: Config = {}) => {
  const tlsCAFile = process.env.CA_FILE_PATH
  if (!tlsCAFile) throw new Error('CA_FILE_PATH undefined')

  const sslConfig = {
    tlsCAFile,
    tls: true,
    authMechanism: 'SCRAM-SHA-1',
    retryWrites: false
  }
  const urlParams: Config = {
    ...options,
    config: {
      ...(options.config || {}),
      ...sslConfig
    }
  }

  await standard(urlParams)
}

export const awsSecretsManager = async () => {
  const dbType = 'mongo'
  const response = await getSecret(dbType)
  if (!response.SecretString) throw new Error("SecretString is undefined in Secrets Manager response");

  const { user, password } = JSON.parse(response.SecretString)
  const pass = encodeURIComponent(password)

  console.log('MONGO SECRET STRING', response.SecretString)
  console.log('Encoded Password', pass)

  const config = { user, pass }

  try {
    await ssl(config)
    console.log("==== Mongo Database connected")
  } catch (err) {
    console.log('MongoDB connection error:', err)
    process.exit(1)
  }
}


