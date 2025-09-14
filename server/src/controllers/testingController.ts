import { Request, Response } from 'express'
import * as api from './webRouteController'
import * as utils from './controllerUtils'

// GET '/'
// GET '/bins'
export const getBins = async (req: Request, res: Response) => {
  req.cookies.session_id = 'test'
  await api.getBins(req, res)
}

// GET '/bins/:bin_id/records'
export const getRecords = async (req: Request, res: Response) => {
  req.cookies.session_id = 'test'
  await api.getRecords(req, res)
}

// GET '/bins/:bin_id/'
export const getBin = async (req: Request, res: Response) => {
  req.cookies.session_id = 'test'
  api.getBin(req, res)
}

// POST /bins/:bin_id
export const createBin = async (req: Request, res: Response) => {
  req.cookies.session_id = 'test'
  await api.createBin(req, res)
}

// POST /:bin_id
export const createRecord = async (req: Request, res: Response) => {
  req.cookies.session_id = 'test'
  await api.createRecord(req, res)
}

// GET '/hello_world'
export const helloWorld = async (req: Request, res: Response) => {
  console.log("COOKIES:", req.cookies)
  console.log("HEADERS:", req.headers)
  if (req?.cookies?.hello) {
    res.send('hello cookie value: ' + req.cookies.hello)
  } else {
    res.cookie('hello', 'World')
    res.send('No hello cookie in request')
  }
}

