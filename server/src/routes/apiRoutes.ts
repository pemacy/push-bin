import express from 'express'
import * as webRouteController from '../controllers/webRouteController'

const webHookRoutes = express.Router()

// API Routes
webHookRoutes.get('/', webRouteController.getBins)
webHookRoutes.get('/bins', webRouteController.getBins)
webHookRoutes.get('/bins/:bin_id', webRouteController.getBin)
webHookRoutes.get('/bins/:bin_id/records', webRouteController.getRecords)

webHookRoutes.post('/:bin_id', webRouteController.createRecord)
webHookRoutes.post('/bins/:bin_id', webRouteController.createBin)
webHookRoutes.post('/bins/:bin_id/records', webRouteController.createRecord)

webHookRoutes.delete('/bins', webRouteController.deleteBins)
webHookRoutes.delete('/bins/:bin_id/records', webRouteController.deleteRecords)
webHookRoutes.delete('/bins/:bin_id', webRouteController.deleteBin)
webHookRoutes.delete('/bins/:bin_id/records/:record_id', webRouteController.deleteRecord)

export default webHookRoutes
