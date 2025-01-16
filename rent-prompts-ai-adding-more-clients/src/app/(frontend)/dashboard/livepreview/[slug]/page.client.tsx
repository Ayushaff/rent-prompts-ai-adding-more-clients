'use client'
import Loader from '@/components/Loader'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { Model } from '@/payload-types'
import { RenderModel } from '@/components/RenderModel'

export const ModelTemplate: React.FC<{
  page: Model | null | undefined
  id: string
}> = ({ page, id }) => {
  const { data } = useLivePreview({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    depth: 2,
    initialData: page,
  })
  return (
    <main>
      <Loader />
      <RenderModel data={data} id={id} />
    </main>
  )
}
