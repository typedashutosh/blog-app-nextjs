import { Document, model, Schema, models, Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'

export interface IUser extends Document {
  [key: string]: any
  _id: string
  firstname: string
  lastname?: string
  username: string
  password: string
  blogs: string[]
}
export interface IUserModel extends Model<IUser> {
  login: (username: string, password: string) => Promise<IUser | null>
}

const UserSchema: Schema = new Schema(
  {
    firstname: { type: String, required: [true, 'Firstname is required'] },
    lastname: { type: String, required: false },
    username: {
      type: String,
      unique: true,
      required: [true, 'Please provide a username']
    },
    password: { type: String, required: [true, 'Please provide a Password'] },
    blogs: { type: Array, required: false }
  },
  { timestamps: true }
)
//- To be checked
// UserSchema.pre<IUser>(`save`, function (this: IUser, next) {
//   bcrypt
//     .hash(this.password, 10)
//     .then((hash) => {
//       this.password = hash
//       next()
//     })
//     .catch((err) => console.log(err))
// })

//* Bcrypt always return false
// * will be looking for crypto js

UserSchema.statics.login = async function (
  username: string,
  password: string
): Promise<IUser | null> {
  const user: IUser = await this.findOne({ username })
  if (user) {
    const auth: boolean = password === user.password ? true : false
    // const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    } else return null
  } else return null
}

export default (models.User ||
  model<IUser, IUserModel>('User', UserSchema)) as IUserModel
