import { CallbackError } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import BlogModel, { IBlog } from '../../../models/Blog.model'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    const { work, id } = req.body
    switch (work) {
      case 'INCREMENT':
        BlogModel.findById(id, (err: CallbackError, doc: IBlog) => {
          if (err) {
            console.log(err)
            res.status(501).end()
          } else {
            doc.votes += 1
            doc.save().then((docNew: IBlog) => res.status(200).json(docNew))
          }
        })
        break
      case 'DECREMENT':
        BlogModel.findById(id, (err: CallbackError, doc: IBlog) => {
          if (err) {
            console.log(err)
            res.status(501).end()
          } else {
            doc.votes += 1
            doc.save().then((docNew: IBlog) => res.status(200).json(docNew))
          }
        })

        break
      default:
        res.status(501).end()
        break
    }
  }
}
