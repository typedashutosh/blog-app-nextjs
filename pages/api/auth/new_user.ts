import { NextApiRequest, NextApiResponse } from 'next'
import UserModel from '../../../models/User.model'
import dbConnect from '../../../utils/dbConnect'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(() => {
    dbConnect()
    const user = req.body
    UserModel.create(user)
      .then((user) => {
        res.status(201).json({
          success: true,
          username: user.username,
          password: user.password
        })
      })
      .catch((err) => {
        if (err.code === 11000) {
          res
            .status(406)
            .json({ errors: [{ message: 'Username already taken' }] })
        } else if (err._message.includes('User validation failed')) {
          let errors: Object[] = []
          Object.values(err.errors).forEach((error: any) => {
            const { properties } = error
            errors.push(properties)
          })
          res.status(406).json({ errors })
        }
      })
  })
}
