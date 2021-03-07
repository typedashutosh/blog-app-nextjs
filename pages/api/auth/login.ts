import { NextApiRequest, NextApiResponse } from 'next'
import User, { IUser } from '../../../models/User.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import { CallbackError } from 'mongoose'
import dbConnect from '../../../utils/dbConnect'

const maxAge: number = 24 * 60 * 60
export const createToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge })

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    dbConnect()
    const { username, password } = req.body
    User.findOne({ username }, (err: CallbackError, user: IUser) => {
      if (err) return console.log(err)
      if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
          if (err) return console.log(err)
          if (same) {
            res.status(201).setHeader(
              'Set-Cookie',
              serialize('token', createToken(user._id), {
                httpOnly: true,
                sameSite: 'lax',
                maxAge,
                path: '/'
              })
            )
            res.json({
              authorised: true,
              username: `${user.firstname} ${user.lastname}`
            })
          } else
            res
              .status(403)
              .json({ authorised: false, message: 'Password mismatched' })
        })
      } else
        res
          .status(404)
          .json({ authorised: false, message: 'Username not found' })
    })
  } else res.status(501).end()
}
