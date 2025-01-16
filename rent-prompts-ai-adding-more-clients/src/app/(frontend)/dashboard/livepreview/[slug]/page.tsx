import { fetchModel } from './fetchModel'
import { ModelTemplate } from './page.client'

interface PageParams {
  params: { slug: string }
  searchParams: { id: string }
}

export default async function Page({ params: { slug }, searchParams: { id } }: PageParams) {
  const page = await fetchModel(id)
  return <ModelTemplate page={page} id={id} />
}
