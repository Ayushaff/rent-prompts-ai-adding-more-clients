'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Menu } from '@headlessui/react'
import { AiOutlineDown, AiOutlineCheck } from 'react-icons/ai'
import axios from 'axios'
import { getAccessResults } from 'payload'
import Link from 'next/link'
// interface UploadedImage {
//   image: string; // Assuming the image ID is a string
// }
type User = {
  id: string
  name: string
  email: string
  avatarUrl?: string
}
type SelectedUser = {
  email: string
  access: boolean
  permissions: string[]
}

interface UsersListProps {
  users: User[]
  access?: any
  formData?: any
  setFormData?: any
  sendInvitationsRef?: any
  selectedUsers: Record<string, SelectedUser>
  setSelectedUsers: React.Dispatch<React.SetStateAction<Record<string, SelectedUser>>>
  isSending: boolean
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>
}

const permissionsOptions = [
  { label: 'Read', value: 'read' },
  { label: 'Update', value: 'update' },
]

function UsersList({
  users,
  formData,
  setFormData,
  sendInvitationsRef,
  selectedUsers,
  setSelectedUsers,
  isSending,
  setIsSending,
}: UsersListProps) {
  // const [selectedUsers, setSelectedUsers] = useState<{
  //   [userId: string]: { email: string; access: boolean; permissions: string[] }
  // }>({})
  // const [isSending, setIsSending] = useState(false)
  const handleCheckboxChange = useCallback(
    (userId: string) => {
      setSelectedUsers((prevSelected) => {
        const user = prevSelected[userId] || {
          email: users.find((u) => u.id === userId)?.email || '',
          permissions: [],
        }
        const newAccess = !user.access

        return {
          ...prevSelected,
          [userId]: {
            ...user,
            access: newAccess,
            permissions: newAccess ? ['read'] : [],
          },
        }
      })
    },
    [users],
  )

  const handlePermissionsChange = useCallback((userId: string, permission: string) => {
    setSelectedUsers((prevSelected) => {
      const userPermissions = prevSelected[userId]?.permissions || []
      const isSelected = userPermissions.includes(permission)

      const updatedPermissions = isSelected
        ? userPermissions.filter((p) => p !== permission)
        : [...userPermissions, permission]

      return {
        ...prevSelected,
        [userId]: {
          ...prevSelected[userId],
          permissions: updatedPermissions,
        },
      }
    })
  }, [])
  const sendInvitations = useCallback(async () => {
    try {
      setIsSending(true);

      const selectedToAccess = Object.entries(selectedUsers)
        .filter(([_, user]) => user.access)
        .map(([userId, user]) => ({
          userId,
          email: user.email,
          permissions: user.permissions,
        }));

      const usersAccessData = selectedToAccess.map((user) => ({
        userId: user.userId,
        getAccess: user.permissions,
      }));
      // setFormData((prev) => ({
      //   ...prev,
      //   access: usersAccessData,
      // }))

      // Step 1: Upload Images
      let uploadedImageIds: { image: string }[] = []; // Explicitly define the type
      if (formData.images && formData.images.length > 0) {
      try {
        // Upload each image and collect their IDs
        for (const imageObj of formData.images) {
          const imageFile = imageObj.image; // Access the File object from the image property
    
          if (imageFile instanceof File) {
    
            const formDatas = new FormData();
            formDatas.append('file', imageFile); // Append the image file
            formDatas.append('user', 'user id'); // Replace with actual user ID
            formDatas.append('alt', 'Rapp Image');
    
            const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/media`, formDatas);
    
            if (res.data.doc?.id) {
              uploadedImageIds.push({
                image: res.data.doc.id, // Image ID
              });
            } else {
              toast.error('Unable to upload image. Please retry.');
              return; // Stop further execution if the image upload fails
            }
          } else {
            console.log('Invalid image object:', imageObj);
          }
        }
      } catch (uploadError) {
        console.error('Error uploading images:', uploadError);
        toast.error('Failed to upload images.');
        return;
      }
    }

      // Step 2: Create Rapp
      const newFormData = { ...formData, images: uploadedImageIds, access: usersAccessData };

      let rappId = null;
      // Determine the API endpoint based on rappCreateType
      const endpoint =
        formData.rappCreateType === "private"
          ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps`
          : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/rapps`;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(newFormData),
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        console.log('result:', result);
        if (result.doc) {
          rappId = result.doc.id;
          toast.success('AI App Created Successfully!');
        } else {
          throw new Error(result.error || 'Failed to create app.');
        }
      } catch (error) {
        console.error('Error creating app:', error);
        toast.error('Failed to create app.');
        return;
      }

      // Step 3: Update Permissions
      if (selectedToAccess?.length > 0 && rappId) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/updateAccessUsers`,
            {
              method: 'POST',
              body: JSON.stringify({ rappId, usersAccessData }),
              headers: { 'Content-Type': 'application/json' },
            },
          );

          const result = await res.json();
          if (result.success) {
            // toast.success('Permissions updated successfully!');
          } else {
            toast.error('Failed to update permissions.');
            throw new Error(result.error || 'Failed to update permissions.');
          }
        } catch (error) {
          console.error('Error updating permissions:', error);
          toast.error('Failed to update permissions.');
        }
      }
      setFormData((prev) => ({
        ...prev,
        access: usersAccessData,
      }))


      // Step 4: Send Invitations
      if (selectedToAccess?.length > 0) {
        try {
          const allInvitations = selectedToAccess.map(async (user) => {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sendPrivateRappsAccess`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email }),
            });
            const result = await response.json();

            if (!result.success) throw new Error(result.error || 'Unknown error');
          });

          await Promise.all(allInvitations);
          toast.success('Invitations sent successfully!');
        } catch (error) {
          console.error('Error sending invitations:', error);
          toast.error('Failed to send some invitations.');
        }
      }
      // else {
      //   toast.success('AI App Created Successfully!');
      // }
    } catch (error) {
      console.error('Error in processing:', error);
      toast.error('An error occurred while processing the request.');
    } finally {
      setIsSending(false);
    }
  }, [formData, selectedUsers, users]);

  useEffect(() => {
    sendInvitationsRef.current = sendInvitations
  }, [sendInvitations])

  const renderRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const user = users[index]

      return (
        <div
          style={style}
          className="flex items-center border-b border-gray-700 hover:bg-indigo-600 cursor-pointer transition-colors"
        >
          <div className="w-1/12 p-2 text-xs md:text-lg text-center text-gray-100">{index + 1}</div>
          <div className="w-6/12 md:w-4/12 p-2 text-xs md:text-lg text-gray-100">{user.email}</div>
          <div className="w-2/12 p-2 text-xs md:text-lg text-center">
            <Checkbox
              checked={selectedUsers[user.id]?.access || false}
              onCheckedChange={() => handleCheckboxChange(user.id)}
              className="border-white"
            />
          </div>
          <div className="w-3/12 md:w-5/12 p-2 text-right md:text-center">
            <div className="flex flex-col md:flex-row md:gap-2 space-y-2 items-end
           justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-gray-100 text-xs md:text-lg">Read:</span>
                <Checkbox
                  checked={selectedUsers[user.id]?.permissions.includes('read')}
                  onClick={() => handlePermissionsChange(user.id, 'read')}
                  disabled
                  className="mr-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-100 text-xs md:text-lg">Update:</span>
                <Checkbox
                  checked={selectedUsers[user.id]?.permissions.includes('update')}
                  onClick={() => handlePermissionsChange(user.id, 'update')}
                  className="mr-2"
                  disabled={!selectedUsers[user.id]?.access}
                />
              </div>
            </div>
            {/* <Menu as="div" className="relative inline-block max-md:hidden text-left">
              <Menu.Button
                className={`inline-flex justify-center w-full rounded-md border border-indigo-800 shadow-sm md:px-4 md:py-2 ${
                  selectedUsers[user.id]?.access
                    ? 'bg-indigo-600'
                    : 'bg-gray-500 cursor-not-allowed'
                } text-sm font-medium text-white`}
                disabled={!selectedUsers[user.id]?.access}
              >
                <h3 className='hidden md:block'>Permissions</h3>
                <AiOutlineDown className="md:-mr-1 md:ml-2 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-indigo-600 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"  onClick={(e) => e.stopPropagation()}>
                <div className="py-1 ">
                  {permissionsOptions.map((option) => (
                    <Menu.Item key={option.value}>
                      {({ active }) => (
                        <div
                          onClick={(e) => {
                            if (option.value !== 'read') {
                              handlePermissionsChange(user.id, option.value)
                            }
                          }}
                          className={`${
                            active ? 'bg-indigo-600 text-white' : 'text-white'
                          } flex items-center px-4 py-2 text-sm cursor-pointer`}
                        >
                          <Checkbox
                            checked={selectedUsers[user.id]?.permissions.includes(option.value)}
                            onClick={(e) => {
                              handlePermissionsChange(user.id, option.value)
                            }}
                            // onCheckedChange={() => handlePermissionsChange(user.id, option.value)}
                            className="mr-2"
                            disabled={option.value === 'read'}
                          />
                          {option.label}
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Menu> */}
          </div>
        </div>
      )
    },
    [users, selectedUsers, handleCheckboxChange, handlePermissionsChange],
  )

  return (
    <>
      <div className="container max-w-full mx-auto p-6 bg-indigo-700 shadow-lg rounded-lg overflow-hidden select-none">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Members List</h2>
          <p className="text-sm text-gray-100 mt-1">Select members to send invitations</p>
        </div>

        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="flex items-center bg-indigo-800 p-2">
            <div className="w-1/12 text-center font-semibold text-xs md:text-lg text-gray-200">#</div>
            <div className="w-6/12 md:w-4/12 font-semibold text-xs md:text-lg text-gray-200">Email</div>
            <div className="w-2/12 text-center md:text-center text-xs md:text-lg font-semibold text-gray-200">Invite</div>
            <div className="w-3/12 md:w-5/12 text-right md:text-center text-xs md:text-lg font-semibold text-gray-200">Permissions</div>
          </div>
          {/* Render rows with react-window */}
          <List height={400} itemCount={users.length} itemSize={60} width="100%">
            {renderRow}
          </List>
        </div>
      </div>

      <div className="p-4 md:p-6 flex justify-between items-center border-t border-gray-700 bg-indigo-600">
        <p className="text-sm text-gray-100">
          {Object.values(selectedUsers).filter((user) => user.access).length} user
          {Object.values(selectedUsers).filter((user) => user.access).length !== 1 ? 's' : ''}{' '}
          selected
        </p>
        {/* <Button
          onClick={sendInvitations}
          disabled={
            Object.values(selectedUsers).filter((user) => user.access).length === 0 || isSending
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          {isSending ? 'Sending Invitations...' : `Send Invitations`}
        </Button> */}
      </div>
    </>
  )
}

export default React.memo(UsersList)
