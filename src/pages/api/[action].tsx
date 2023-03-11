import type { NextApiRequest, NextApiResponse } from 'next'
import { pingClient, pingUrl, suspend, wol } from 'utils'

type Response = { isActive: boolean } | { sent: boolean }

const action = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { query, body } = req
  const { action } = query
  const { host, mac } = JSON.parse(body)

  if (action === 'pingClient') {
    pingClient(host).then(isActive => res.status(200).json({ isActive }))
  } else if (action === 'pingUrl') {
    pingUrl(host).then(isActive => res.status(200).json({ isActive }))
  } else if (action === 'suspend') {
    suspend(host).then(sent => res.status(200).json({ sent }))
  } else if (action === 'wol') {
    wol(mac).then(sent => res.status(200).json({ sent }))
  } else {
    res.status(404)
  }
}

export default action
