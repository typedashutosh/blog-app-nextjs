import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    res.setHeader(
      'Set-Cookie',
      serialize('token', '', { httpOnly: true, maxAge: 1, sameSite: 'lax' })
    )
    res.json({ authorised: false })
  }
}
