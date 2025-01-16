import { User } from '@/payload-types'
import { BeforeChangeHook } from 'node_modules/payload/dist/collections/config/types'

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null
  if (user) return { ...data, user: user.id }
  return data
}
export default addUser
