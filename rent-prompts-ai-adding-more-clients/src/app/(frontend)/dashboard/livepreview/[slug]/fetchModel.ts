import axios from 'axios'
export const fetchModel = async (id: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/models/livepreview/${id}`,
    )
    const pageRes = res.data.data
    // console.log('pageRes', pageRes)
    return pageRes
  } catch (e) {
    console.log('Fetch Model Error in Live Preview', e.message)
    return null
  }
}
