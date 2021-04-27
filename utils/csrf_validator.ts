import { createHash } from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse): boolean => {
  try {
    if (!req.headers.cookie) {
      res.status(403).json({ error: { status: 'no cookie?' } })
      return false
    } else {
      const rawCookieString = req.headers.cookie // raw cookie string, possibly multiple cookies
      const rawCookiesArr = rawCookieString.split(';')

      let parsedCsrfTokenAndHash = null

      for (let i = 0; i < rawCookiesArr.length; i++) {
        // loop through cookies to find CSRF from next-auth
        let cookieArr = rawCookiesArr[i].split('=')
        if (cookieArr[0].trim().search('next-auth.csrf-token')) {
          parsedCsrfTokenAndHash = cookieArr[1]
          break
        }
      }

      if (!parsedCsrfTokenAndHash) {
        res.status(403).json({ error: { status: 'missing csrf' } }) // can't find next-auth CSRF in cookies
        return false
      } else {
        // delimiter could be either a '|' or a '%7C'
        const tokenHashDelimiter =
          parsedCsrfTokenAndHash.indexOf('|') !== -1 ? '|' : '%7C'

        const [requestToken, requestHash] = parsedCsrfTokenAndHash.split(
          tokenHashDelimiter
        )

        const secret = process.env.SECRET

        // compute the valid hash
        const validHash = createHash('sha256')
          .update(`${requestToken}${secret}`)
          .digest('hex')
        if (requestHash !== validHash) {
          res.status(403).json({ error: { status: 'bad hash' } }) // bad hash
          return false
        }
      }
    }
  } catch (err) {
    res.status(500).json({ error: { status: 'catch-all no' } })
    return false
  }
  return true
}
