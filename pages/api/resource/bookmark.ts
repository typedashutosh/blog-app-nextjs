import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import UserModel, { IUser } from '../../../models/User.model'
import dbConnect from '../../../utils/dbConnect'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(async () => {
    if (req.method === 'POST') {
      dbConnect()

      const { blogID } = JSON.parse(req.body) as Record<string, string>

      const session = await getSession({ req })
      const _id = session?.user._id

      const user: IUser = await UserModel.findById(_id)
      user.blogs.push(blogID)
      user.save()
      res.status(201).end()
    }
  })
}
