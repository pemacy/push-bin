import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const getSecret = async (dbType: 'mongo' | 'postgres') => {
  let secret_name
  if (dbType === 'mongo') {
    secret_name = process.env.AWS_MONGO_SECRET_NAME
    if (!secret_name) throw new Error('AWS_MONGO_SECRET_NAME not defined')
  } else if (dbType === 'postgres') {
    secret_name = process.env.AWS_POSTGRES_SECRET_NAME
    if (!secret_name) throw new Error('AWS_POSTGRES_SECRET_NAME not defined')
  }

  const client = new SecretsManagerClient({
    region: "us-east-1",
  });

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
    return response
  } catch (error) {
    console.log("An error occurred getting the secrets manager", error)
    throw error;
  }
}

export default getSecret
