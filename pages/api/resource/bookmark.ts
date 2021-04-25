import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import UserModel, { IUser } from '../../../models/User.model'
import dbConnect from '../../../utils/dbConnect'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(async () => {
    if (req.method === 'POST') {
      const { work } = JSON.parse(req.body) as Record<string, string>
      if (work === 'Find Bookmarks') {
        dbConnect()

        const { BlogID } = JSON.parse(req.body) as Record<string, string>
        const _id = (await getSession({ req }))?.user._id

        const user: IUser | null = await UserModel.findById(_id)
        if (!!user) {
          res.json({ bookmarked: user.blogs.includes(BlogID) })
        } else res.status(400).end()
      }

      if (work === 'Add Bookmark') {
        dbConnect()

        const { blogID } = JSON.parse(req.body) as Record<string, string>

        const session = await getSession({ req })
        const _id = session?.user._id

        const user: IUser | null = await UserModel.findById(_id)
        if (user) {
          user.blogs.push(blogID)
          user.save()
          res.status(201).end()
        } else res.status(400).end()
      }
    }
  })
}
