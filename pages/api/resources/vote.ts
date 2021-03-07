import { NextApiRequest, NextApiResponse } from 'next'
import BlogModel, { IBlog } from '../../../models/Blog.model'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    const { work, id } = req.body
    switch (work) {
      case 'INCREMENT':
        BlogModel.findOne({ id })
          .then((doc: IBlog) => {
            doc.votes += 1
            doc.save().then((docNew: IBlog) => res.status(200).json(docNew))
          })
          .catch(err => console.log(err))
        break
      case 'DECREMENT':
        BlogModel.findOne({ id })
          .then((doc: IBlog) => {
            doc.votes -= 1
            doc.save().then((docNew: IBlog) => res.status(200).json(docNew))
          })
          .catch(err => console.log(err))
        break
      default:
        res.status(501).end()
        break
    }
  }
}