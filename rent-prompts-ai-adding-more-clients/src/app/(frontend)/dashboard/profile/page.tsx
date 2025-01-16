'use client'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdLocationOn, MdEdit } from 'react-icons/md'
import { ClipLoader } from 'react-spinners'
import { toast } from 'sonner'
import ApiKeyFetch from '@/components/ui/Profile/ApiKeyFetch'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUser } from '@/providers/User'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/Icons'
import { Edit, Kanban, Waypoints } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  position: string
  team: string
  coinBalance: number
  location: string
  profileImage: string
  ownedRAPPs: { name: string; revenue: number }[]
  managedRAPPs: { name: string; revenue: number }[]
  tokens: number;
}

interface Rapp {
  image: string
  id: string
  type: string
  model?: string
  rappName: string
  rappDes: string
  cost: number
  commission?: number
  rappStatus: string
  createdAt: string
  updatedAt: string
  slug: string
}

const UserProfile = () => {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)
  const [rappData, setRappData] = useState<Rapp[]>([])
  const [ownedRapps, setOwnedRapps] = useState<Rapp[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<User | null>(null)
  const user = useUser() as User | null
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      return router.push('/auth/signIn')
    }
    if (user) {
      setUserData(user)
      setEditedData(user)
    }
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/privateRapps/getRapps`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        })
        const data = await res.json()
        setRappData(data.data.myRapps)
        setOwnedRapps(data.data.accessRapps)
      } catch (err) {
        setError('Failed to load RAPPs data')
        toast.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editedData) {
      setEditedData({ ...editedData, [name]: value })
    }
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      setImageFile(file)
      // Convert the file to a Base64 string
      const base64String = await convertImageToBase64(file)

      setEditedData(
        (prev) =>
          prev && {
            ...prev,
            profileImage: base64String,
          },
      )
    }
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        resolve(reader.result as string)
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsDataURL(file)
    })
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      toast.loading('Saving changes...')
      let imageUploadedId = ''

      if (imageFile) {
        try {
          setLoading(true)
          // toast.loading('Uploading image...')

          const formData = new FormData()
          formData.append('file', imageFile)
          formData.append('user', userData?.id || '')
          formData.append('alt', 'Profile Image')

          const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/media`, formData)

          imageUploadedId = res.data.doc.id

          if (!imageUploadedId) {
            toast.error('Unable to upload image. Please retry.')
            setLoading(false)
            return
          }

          toast.dismiss()
          setLoading(false)
        } catch (uploadError) {
          toast.dismiss()
          toast.error('Failed to upload image.')
          setLoading(false)
          return
        }
      }

      if(imageFile){
        var req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/updateProfile`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userData?.id,
            name: editedData?.name,
            email: editedData?.email,
            profileImage: imageUploadedId,
          }),
        })
      }else{
        var req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/updateProfile`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userData?.id,
            name: editedData?.name,
            email: editedData?.email,
          }),
        })
      }
      
      const data = await req.json()
      const updatedUser = data.data

      if (!req.ok) {
        throw new Error('Failed to update user information.')
      }
      toast.success('User info updated successfully!')
      window.location.reload();
      setUserData(updatedUser)
      setIsEditing(false)
    } catch (err) {
      toast.error(err.message || 'Failed to save changes')
      // setError('Failed to save changes')
    } finally {
      toast.dismiss()
      setLoading(false)
    }
  }

  const totalCost = ownedRapps.reduce((sum, rapp) => sum + rapp.cost, 0)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <ClipLoader color="#ffffff" loading={loading} size={50} />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>
  }

  return (
    <div className="mx-auto bg-indigo-800 md:shadow-xl rounded-lg text-white relative">
      {/* Profile header */}
      <div
        className={`relative z-10 mt-4 bg-gradient-to-br from-black/[0.3] via-black/[0.1] to-black/[0.4] p-5 flex flex-col md:flex-row items-start gap-6 w-full rounded-xl ${
          isEditing && 'pt-12'
        }`}
      >
        <div className="w-full">
          {isEditing ? (
            <div className="grid gap-4 grid-cols-1">
              {/* Profile Image */}
              <div className="flex justify-center flex-col items-center">
              <div className="relative group w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-indigo-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl mt-5 md:mt-0">
                {/* Profile Image */}
                <Image
                  src={
                    editedData?.profileImage && editedData.profileImage !== 'undefined'
                      ? editedData.profileImage
                      : '/DummyUser.webp'
                  }
                  alt="User Profile Picture"
                  width={144}
                  height={144}
                  className="object-cover w-full h-full rounded-full"
                />

                {/* Edit Icon - Positioned at the bottom-right inside the circle */}
                <label
                  className="absolute bottom-0 right-1 z-50 bg-indigo-500 p-2 rounded-full cursor-pointer shadow-lg hover:bg-indigo-600 transition-all duration-300"
                  htmlFor="profile-image-input"
                >
                  <Edit className="w-5 h-5 text-white" />
                  {/* Hidden File Input */}
                  <input
                    id="profile-image-input"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    aria-label="Upload new profile picture"
                    />
                  </label>
                </div>

                {/* Text below the image */}
                <p
                  className="mt-3 text-center text-white font-semibold cursor-pointer hover:text-indigo-300 transition"
                  onClick={() => document.getElementById('profile-image-input')?.click()}
                >
                  Change Profile Photo
                </p>
              </div>

              {/* Input Fields */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {/* <div className="space-y-4"> */}
                <div>
                  <Label>Name:</Label>
                  <Input
                    type="text"
                    name="name"
                    value={editedData?.name}
                    onChange={handleInputChange}
                    className="bg-indigo-700 text-white rounded-md px-3 py-1 w-full"
                  />
                </div>
                <div>
                  <Label>Email:</Label>
                  <Input
                    type="text"
                    name="email"
                    value={editedData?.email || ''}
                    onChange={handleInputChange}
                    className="bg-indigo-700 text-white rounded-md px-3 py-1 w-full"
                  />
                </div>
                <div>
                  {/* <Label>Designation:</Label>
                  <Input
                    type="text"
                    name="position"
                    value={editedData?.position || ''}
                    onChange={handleInputChange}
                    className="bg-indigo-700 text-white rounded-md px-3 py-1 w-full"
                  /> */}
                </div>
                <div>
                  {/* <Label>Location:</Label>
                  <Input
                    type="text"
                    name="location"
                    value={editedData?.location || ''}
                    onChange={handleInputChange}
                    className="bg-indigo-700 text-white rounded-md px-3 py-1 w-full"
                  /> */}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-28 h-28 sm:w-36 sm:h-36 sm:min-w-36 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg">
                <Image
                  src={userData?.profileImage || '/DummyUser.webp'}
                  alt="User Profile Picture"
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="w-full">
                <h1 className="text-3xl font-bold mb-1">{userData?.name}</h1>
                <p className="text-gray-300">{userData?.email}</p>
                <p className="mt-2 text-gray-400">{userData?.position || 'Software Developer'}</p>
                <p className="mt-1 text-sm text-gray-400 flex items-center">
                  <MdLocationOn className="mr-2" /> {userData?.location || 'Indore'}
                </p>
                <div className="flex flex-col md:flex-row gap-3 items-left md:items-end md:justify-between w-full">
                  <ApiKeyFetch />
                  <div className="text-gray-300 font-semibold flex items-left flex-col">
                    <div className='flex'>
                    <p>Balance: {userData?.coinBalance !== undefined && !isNaN(userData.coinBalance)
      ? userData.coinBalance % 1 === 0
        ? userData.coinBalance.toFixed(0)
        : userData.coinBalance.toFixed(1)
      : "Loading..."}</p>
                    <Image src="/coin-png.png" alt="coin image" width={18} height={18} />
                    </div>
                    <div className='flex'>
                    <p>Joule consumed: {userData?.tokens || 0} </p>
                    <Image src="/coin-png.png" alt="coin image" width={18} height={18} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isEditing ? (
          <>
            <div className="absolute top-4 right-24 flex gap-2">
              <button
                onClick={handleSaveChanges}
                className="bg-green-500 hover:bg-green-600 text-sm text-white py-2 px-3 rounded-md"
              >
                Save Changes
              </button>
            </div>
            <div className="absolute top-4 right-4">
              <button
                onClick={handleEditToggle}
                className="bg-red-500 hover:bg-red-600 text-sm text-white py-2 px-3 rounded-md"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="absolute top-4 right-4 p-2 rounded-full bg-indigo-700 hover:bg-indigo-600 text-white"
          >
            <MdEdit className="text-2xl" />
          </button>
        )}
      </div>

      {/* Owned and Managed RAPPs */}
      <div className="relative z-10 md:p-6">
        <div className="flex items-center  mt-4 md:mt-0 mb-2 md:mb-4 gap-2">
          <Kanban />
          <h2 className="text-2xl font-semibold">Owned AI APP&apos;s</h2>
        </div>

        {rappData?.length === 0 ? (
          <p className="text-gray-400">No self-owned AI Apps available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
            {rappData?.map((rapp, index) => (
              <Link
                href={`/dashboard/projects/${rapp.rappName}?id=${rapp.id}&type=private`}
                key={rapp.id}
                className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-4 items-center bg-gradient-to-r from-black/[0.3] via-black/[0.1] to-black/[0.4] p-2 sm:p-4 rounded-md w-full shadow hover:shadow-lg transition"
                style={{ gridTemplateColumns: '6fr 1fr 1fr 1fr auto' }}
              >
                <div className="overflow-hidden flex items-center gap-3 sm:gap-4">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-md overflow-hidden min-w-8 md:min-w-12">
                    <Image
                      src={rapp.image || '/DummyRapps.png'}
                      width={64}
                      height={64}
                      alt="dummy image"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-xs sm:text-base break-words whitespace-normal">
                    <h5 className="font-medium text-white break-word whitespace-normal">
                      {rapp.rappName}
                    </h5>
                    <p className="text-gray-500 dark:text-gray-400 truncate">{rapp.rappDes}</p>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-right text-white flex justify-end items-center">
                  <p className="leading-none">{rapp.cost}</p>
                  <Image src="/coin-png.png" alt="coin" width={16} height={16} />
                </div>

                <p className="text-xs sm:text-sm text-center text-white">{rapp.model}</p>
                <div
                  className={`text-xs sm:text-sm font-medium w-fit flex justify-self-center px-1 py-1 sm:px-2 sm:py-2 rounded-full text-right sm:text-center ${
                    rapp.rappStatus === 'approved'
                      ? 'bg-white/[0.1] text-success'
                      : rapp.rappStatus === 'pending'
                        ? 'bg-white/[0.1] text-warning'
                        : 'bg-white/[0.1] text-danger'
                  }`}
                >
                  {rapp.rappStatus === 'approved' && (
                    <p className="flex flex-row gap-1 items-center">
                      <Icons.approved /> <span className="hidden md:block">Approved</span>
                    </p>
                  )}
                  {rapp.rappStatus === 'pending' && (
                    <p className="flex flex-row gap-1 items-center">
                      <Icons.pending /> <span className="hidden md:block">Pending</span>
                    </p>
                  )}
                  {rapp.rappStatus === 'denied' && (
                    <p className="flex flex-row gap-1 items-center">
                      <Icons.denied /> <span className="hidden md:block">Denied</span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Enterprise Consumption */}

      <div className="relative z-10 mt-6 md:mt-0 md:p-6">
        <div className="flex items-center  mt-4 md:mt-0 gap-2">
          <Waypoints />
          <h2 className="text-2xl font-semibold">Shared AI APP&apos;s</h2>
        </div>
        {ownedRapps?.length === 0 ? (
          <p className="text-gray-400">No enterprise consumption data available.</p>
        ) : (
          <>
            <p className="text-sm md:text-lg mb-2 md:mb-4 font-semibold">
              Total Consumed: {totalCost}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
              {ownedRapps?.map((rapp, index) => (
                <Link
                  href={`/dashboard/projects/${rapp.rappName}?id=${rapp.id}&type=private`}
                  key={rapp.id}
                  className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-4 items-center bg-gradient-to-r from-black/[0.3] via-black/[0.1] to-black/[0.4] p-2 sm:p-4 rounded-md w-full shadow hover:shadow-lg transition"
                  style={{ gridTemplateColumns: '6fr 1fr 1fr 1fr auto' }}
                >
                  <div className="overflow-hidden flex items-center gap-3 sm:gap-4">
                    <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-md overflow-hidden min-w-8 md:min-w-12">
                      <Image
                        src={rapp.image || '/DummyRapps.png'}
                        width={64}
                        height={64}
                        alt="dummy image"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-xs sm:text-base break-words whitespace-normal">
                      <h5 className="font-medium text-white break-word whitespace-normal">
                        {rapp.rappName}
                      </h5>
                      <p className="text-gray-500 dark:text-gray-400 truncate">{rapp.rappDes}</p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-right text-white flex justify-end items-center">
                    <p className="leading-none">{rapp.cost}</p>
                    <Image src="/coin-png.png" alt="coin" width={16} height={16} />
                  </div>
                  <p className="text-xs sm:text-sm text-center text-white">{rapp.model}</p>
                  <div
                    className={`text-xs sm:text-sm font-medium w-fit flex justify-self-center px-1 py-1 sm:px-2 sm:py-2 rounded-full text-right sm:text-center ${
                      rapp.rappStatus === 'approved'
                        ? 'bg-white/[0.1] text-success'
                        : rapp.rappStatus === 'pending'
                          ? 'bg-white/[0.1] text-warning'
                          : 'bg-white/[0.1] text-danger'
                    }`}
                  >
                    {rapp.rappStatus === 'approved' && (
                      <p className="flex flex-row gap-1 items-center">
                        <Icons.approved /> <span className="hidden md:block">Approved</span>
                      </p>
                    )}
                    {rapp.rappStatus === 'pending' && (
                      <p className="flex flex-row gap-1 items-center">
                        <Icons.pending /> <span className="hidden md:block">Pending</span>
                      </p>
                    )}
                    {rapp.rappStatus === 'denied' && (
                      <p className="flex flex-row gap-1 items-center">
                        <Icons.denied /> <span className="hidden md:block">Denied</span>
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UserProfile
