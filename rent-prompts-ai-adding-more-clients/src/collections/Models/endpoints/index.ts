import { Endpoint } from 'payload'
import { getAllModels, getModelbySlug } from './getAllModels'
import livePreview from './livePreview'
import testModel from './testModel'

const endpoints: Omit<Endpoint, 'root'>[] = [
  {
    method: 'get',
    path: '/getAll',
    handler: getAllModels,
  },
  {
    method: 'get',
    path: '/livepreview/:id',
    handler: livePreview,
  },
  {
    method: 'post',
    path: '/testModel/:id',
    handler: testModel,
  },
  {
    method: 'get',
    path: '/:slug',
    handler: getModelbySlug,
  },
]
export default endpoints
