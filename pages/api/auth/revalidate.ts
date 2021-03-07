import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import { createToken } from './login'
let i = 1
setInterval(() => {
  i++
}, 1000)
export default (req: NextApiRequest, res: NextApiResponse) => {
  const token = req?.headers.cookie
    ?.split(';')
    .find((str) => str.trim().startsWith('token='))
  const coded = token?.split('=')[1]
  if (!coded) res.status(404).json({ _event: 'NO TOKEN FOUND' })
  else {
    console.log(i, coded)
    const decoded: any = jwt.verify(coded, process.env.JWT_SECRET)
    const id = decoded.id
    res.status(200).setHeader(
      `Set-Cookie`,
      serialize(`token`, createToken(id), {
        httpOnly: true,
        path: '/',
        sameSite: 'lax'
      })
    )
  }
}
