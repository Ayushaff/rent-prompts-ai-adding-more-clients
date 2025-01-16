'use client'

import useSWR from 'swr'
import UsersList from './UsersList'
import { ClipLoader } from 'react-spinners'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type SelectedUser = {
  email: string
  access: boolean
  permissions: string[]
}
interface Step4RappDetailsProps {
  formData: any
  setFormData: any
  sendInvitationsRef: any
  selectedUsers: Record<string, SelectedUser>
  setSelectedUsers: React.Dispatch<React.SetStateAction<Record<string, SelectedUser>>>
  isSending: boolean
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>
  isVisible: boolean
}
const Step4RappDetails = ({
  formData,
  setFormData,
  sendInvitationsRef,
  selectedUsers,
  setSelectedUsers,
  isSending,
  setIsSending,
  isVisible,
}: Step4RappDetailsProps) => {
  const { data, error } = useSWR('/api/users/onboarded-members-list', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const users = data?.data || []

  if (error) return <div>Failed to load users</div>
  if (!data)
    return (
      <div className="flex justify-center items-center h-32">
        <ClipLoader color="#ffffff" loading={!data} size={50} />
      </div>
    )

  return (
    <div className={isVisible ? '' : 'hidden'}>
      <UsersList
        users={users}
        formData={formData}
        setFormData={setFormData}
        sendInvitationsRef={sendInvitationsRef}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        isSending={isSending}
        setIsSending={setIsSending}
      />
    </div>
  )
}

export default Step4RappDetails
