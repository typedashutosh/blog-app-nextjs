import { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/User.model'
import dbConnect from '../../../utils/dbConnect'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    dbConnect()
    const user = req.body
    User.create(user)
      .then(user => res.status(201).redirect('/api/auth/login'))
      .catch(err => {
        err.code === 11000 ? res.status(406).json({ success: false, message: 'Username already taken' }) : null
        err._message === 'User validation failed' ? res.status(406).json({ success: false, message: 'Firstname is required' }) : null
        res.status(501).end()
      })
  }
}