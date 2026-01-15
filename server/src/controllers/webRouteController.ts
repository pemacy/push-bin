import { WebSocket } from 'ws'
import { Request, Response } from 'express'
import WebhookPayload from '../models/WebhookPayload'
import * as utils from './controllerUtils'
import { wss } from '../server'

// GET '/'
export const getHealth = async (_req: Request, res: Response) => {
  res.send("Good Health")
}

export const getBins = async (req: Request, res: Response) => {
  const pgClient = await utils.setPgClient()
  if (req.cookies.session_id) {
    const session_id = req.cookies.session_id
    const query = 'SELECT * FROM bins WHERE session_id = $1'
    const values = [session_id]
    const bins = await pgClient.query(query, values)
    console.log(query, '- VALUES:', values)
    res.json(bins.rows)
  } else {
    const session_id = utils.setSessionId(res)
    res.json([])
  }
}

// GET '/bins/:bin_id'
export const getBin = async (req: Request, res: Response) => {
  const pgClient = await utils.setPgClient()
  const bin_id = req.params.bin_id
  const query = 'SELECT * FROM bins WHERE id = $1'
  const values = [bin_id]
  const queryResult = await pgClient.query(query, values)
  console.log(query, '- VALUES:', values)
  const bin = queryResult.rows[0]

  res.json(bin)
}

// GET '/:bin_id/records'
export const getRecords = async (req: Request, res: Response) => {
  const pgClient = await utils.setPgClient()
  const bin_id = req.params.bin_id
  console.log(req.headers)
  const query = 'SELECT * FROM records WHERE bin_id = $1'
  const values = [bin_id]
  const queryResult = await pgClient.query(query, values)
  console.log(query, '- VALUES:', values)
  const recordsWithDocs = await Promise.all(
    queryResult.rows.map(utils.addMongoDoc)
  )

  res.json(recordsWithDocs)
}

// POST '/:bin_id'
// POST '/bins/:bin_id/records'
export const createRecord = async (req: Request, res: Response) => {
  const pgClient = await utils.setPgClient()
  const payload = req.body
  const bin_id = req.params.bin_id
  const method = req.method
  const headers = req.headers

  console.log('HEADERS', headers)
  const newPayload = new WebhookPayload({ payload, headers })
  const savedPayload = await newPayload.save()
  const mongoDocId = savedPayload._id.toString()

  const query = 'INSERT INTO records (method, bin_id, mongo_doc_id) VALUES ($1, $2, $3) RETURNING *'
  const values = [method, bin_id, mongoDocId]
  const queryResult = await pgClient.query(query, values)

  console.log(query, '- VALUES:', values)
  const record = queryResult.rows[0]

  const recordWithDoc = await utils.addMongoDoc(record)
  console.log(Object.keys(recordWithDoc))

  wss.clients.forEach((client) => {
    console.log("INSIDE WEB SOCKET")
    if (client.readyState === WebSocket.OPEN) {
      console.log(client.url)
      client.send(JSON.stringify(recordWithDoc))
    }
  })
  res.status(200).json(record)
}

// POST '/bins/new/:bin_id'
export const createBin = async (req: Request, res: Response) => {
  const pgClient = await utils.setPgClient()
  // request will have name of bin
  const bin_id = req.params.bin_id
  let session_id: string

  if (req.cookies.session_id) {
    session_id = req.cookies.session_id
  } else {
    session_id = utils.setSessionId(res)
  }

  const query = "INSERT INTO bins (id, session_id) VALUES ($1, $2) RETURNING *"
  const values = [bin_id, session_id]
  const queryResult = await pgClient.query(query, values)
  console.log(query, '- VALUES:', values)
  const bin = queryResult.rows[0]
  res.status(200).json(bin)
}


// DETELE /bins/:bin_id/records/:record_id
export const deleteRecord = async (req: Request, res: Response) => {
  const pgClient = await utils.setPgClient()
  const binId = req.params.bin_id
  const recordId = req.params.record_id
  const query = 'DELETE FROM records WHERE bin_id = $1 AND id = $1 RETURNING *'
  const values = [binId, recordId]
  const result = await pgClient.query(query, values)
  console.log(query, '- VALUES:', values)
  const record = result.rows[0]
  res.json(record)
}

// DETELE /bins/:bin_id/records
export const deleteRecords = async (req: Request, res: Response) => {
  const pgClient = await utils.setPgClient()
  const query = 'DELETE FROM records RETURNING *'
  const result = await pgClient.query(query)
  const records = result.rows

  console.log(query, '- VALUES:')
  console.log("DELETED RECORDS:", records)

  await Promise.all(records.map(utils.deleteMongoDoc))
  res.json(records)
}

// DETELE /bins/:bin_id
export const deleteBin = async (req: Request, res: Response) => {
  const pgClient = await utils.setPgClient()
  const binId = req.params.bin_id
  let query = 'SELECT * FROM records WHERE bin_id = $1'
  const values = [binId]
  const recordsResult = await pgClient.query(query, [binId])
  const records = recordsResult.rows
  console.log(query, '- VALUES:', values)
  console.log("DELETED RECORDS:", records)

  query = 'DELETE FROM bins WHERE id = $1 RETURNING *'
  const result = await pgClient.query(query, [binId])
  const bin = result.rows[0]
  console.log(query, '- VALUES:', values)
  console.log("DELETED BIN:", bin)

  await Promise.all(records.map(utils.deleteMongoDoc))
  res.json(bin)
}

// DETELE /bins
export const deleteBins = async (req: Request, res: Response) => {
  const pgClient = await utils.setPgClient()
  const session_id = req.cookies.session_id

  // Get all bins with that session id
  let query = 'SELECT * FROM bins WHERE session_id = $1'
  const values = [session_id]
  const binsResult = await pgClient.query(query, values)
  let bins = binsResult.rows
  console.log(query, '- VALUES:', values)

  const recordArrays = await Promise.all(bins.map(utils.getBinRecords))
  const records = recordArrays.flat()
  await Promise.all(records.map(utils.deleteMongoDoc))

  query = 'DELETE FROM bins WHERE session_id = $1 RETURNING *'
  const deleteResult = await pgClient.query(query)
  bins = deleteResult.rows
  console.log(query, '- VALUES:', values)
  console.log("DELETED BINS:", bins)
  console.log("DELETED RECORDS:", records)

  const data = { bins, records }
  res.json(data)
}
