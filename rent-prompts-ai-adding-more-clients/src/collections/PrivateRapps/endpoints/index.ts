import { Endpoint } from 'payload'
import createRapp from './createRapp'
import runRapp from './runRapp'
import {
  // getMemberRapps,
  getPromptBySlug,
  getRappById,
  getRappBySlug,
  getRapps,
  updateAccess,
  updatePermissions,
  updatePrompts,
} from './getRapps'
import { updateAccessList, updateAccessUsers } from './updateRapp'
import { purchaseRapps } from './privateRappPurchase'

const endpoints: Omit<Endpoint, 'root'>[] = [
  {
    method: 'post',
    path: '/create',
    handler: createRapp,
  },
  {
    method: 'post',
    path: '/run/:id',
    handler: runRapp,
  },
  {
    method: 'post',
    path: '/getRapps',
    handler: getRapps,
  },
  {
    method: 'get',
    path: '/:id',
    handler: getRappBySlug,
  },
  {
    method: 'get',
    path: '/getPromptBySlug/:id',
    handler: getPromptBySlug,
  },
  // {
  //   method: 'post',
  //   path: '/getMemberRapps',
  //   handler: getMemberRapps,
  // },
  // {
  //   method: 'get',
  //   path: '/getRappById/:id',
  //   handler: getRappById,
  // },
  {
    method: 'post',
    path: '/updatePrivateRapps/:id/:type',
    handler: updateAccess,
  },
  {
    method: 'post',
    path: '/updatePermissions/:id',
    handler: updatePermissions,
  },
  {
    method: 'post',
    path: '/updateAccessList/:id',
    handler: updateAccessList,
  },
  {
    method: 'post',
    path: '/updateAccessUsers',
    handler: updateAccessUsers,
  },
  {
    method: 'post',
    path: '/purchase',
    handler: purchaseRapps,
  },
  {
    method: 'post',
    path: '/updatePrompts/:id',
    handler: updatePrompts,
  },
]
export default endpoints
