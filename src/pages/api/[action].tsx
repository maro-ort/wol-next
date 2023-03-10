import type { NextApiRequest, NextApiResponse } from 'next'
import { ping, suspend, wol } from 'utils'

type Response = { isActive: boolean } | { sent: boolean }

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { query, body } = req
  const { action } = query
  const { host, mac } = JSON.parse(body)

  if (action === 'ping') {
    await ping(host).then(isActive => res.status(200).json({ isActive }))
  } else if (action === 'suspend') {
    suspend(host).then(sent => res.status(200).json({ sent }))
  } else if (action === 'wol') {
    wol(mac).then(sent => res.status(200).json({ sent }))
  } else {
    res.status(404)
  }
}
