import { NextApiRequest, NextApiResponse } from 'next'
import BlogModel, { IBlog } from '../../../models/Blog.model'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import UserModel, { IUser } from '../../../models/User.model'
import { CallbackError } from 'mongoose'
// import dbConnect from '../../../utils/dbConnect'

const JWT_SECRET = process.env.JWT_SECRET

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    //--- Extracting token

    const cookie = req.headers.cookie?.split(';').find((cookie) => cookie.trim().startsWith('token='))
    const token = cookie?.split('=')[1]

    if (!token) res.status(404).json({ _event: 'NO TOKEN FOUND' })
    else {
      //--- Verifying token

      jwt.verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: any) => {
        if (err) res.status(401).json({ _event: 'INVALID TOKEN' })
        else {
          //--- Finding User in Database

          const authorID: string | undefined = decoded.id
          // console.log(authorID)
          // dbConnect() //? Do i need to connect to database every time i make a request???
          UserModel.findById(authorID, (err: CallbackError, doc: IUser) => {
            if (err) console.log('err:::>', err)
            // console.log('doc:::>', doc) //--- If there is no usere, doc returns null
            else if (doc === null) res.status(401).json({ _event: "USER DOESN'T EXIST" })
            else {
              //--- Since user exists, Let's create a Blog :}
              const user: IUser = doc
              // console.log(user) //--- User Recheck gone correct, CONTINUE
              const newBlog: IBlog = new BlogModel({
                title: ' ',
                description: ' ',
                authorID: authorID,
                author: `${user.firstname} ${user.lastname}`,
                content: ' ',
                mode: 'private',
                state: 'draft',
                votes: 0
              })
              newBlog.save().then((doc) => {
                // console.log(doc) //--- Since we recieving the document correctly, we can send the response with the blog id, back to client

                res.json({ blogID: newBlog._id, _event: 'CREATED' })
              })
            }
          })
        }
      })
    }
  } //--- POST method ends here

  if (req.method === 'PATCH') {
    const { work, BlogID, title, description, content, mode } = req.body
    if (work === 'UPDATE') {
      BlogModel.findByIdAndUpdate(BlogID, { title, description, content, mode }, { new: true }, (err, doc: IBlog) => {
        if (err) {
          console.log(err)
          res.status(400).json({ err })
        } else if (doc._id.toString() === BlogID) res.status(200).json({ _event: 'UPDATED' })
      }) //---Doc Updated
    }
    if (work === 'PUBLISH') {
      BlogModel.findByIdAndUpdate(
        BlogID,
        { title, description, content, mode, state: 'PUBLISHED' },
        { new: true },
        (err, doc: IBlog) => {
          if (err) {
            console.log(err)
            res.status(400).json({ err })
          } else if (doc._id.toString() === BlogID) res.status(200).json({ _event: 'SAVED' })
        }
      ) //---Doc Saved and Published
    }
    if (work === 'DELETE') {
      BlogModel.findByIdAndDelete(BlogID, undefined, (err, doc) => {
        if (err) {
          console.log(err)
          res.status(400).json({ err })
        } else {
          res.status(200).json({ _event: 'DELETED' })
        }
      })
    }
  }
}
