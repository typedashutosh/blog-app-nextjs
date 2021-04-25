// import * as bcrypt from 'bcryptjs'
// import { Document, Schema, Model, model } from 'mongoose'

// export interface IUser extends Document {
//   firstname: string
//   lastname?: string
//   username: string
//   password: string
//   blogs: string[]
// }
// export interface IUserModel extends Model<IUser> {
//   hashPassword(password: string): string
// }

// export const userSchema: Schema = new Schema(
//   {
//     firstname: { type: String, required: [true, 'Firstname is required'] },
//     lastname: { type: String, required: false },
//     username: {
//       type: String,
//       unique: true,
//       required: [true, 'Please provide a username']
//     },
//     password: { type: String, required: [true, 'Please provide a Password'] },
//     blogs: { type: Array, required: false }
//   },
//   { timestamps: true }
// )

// userSchema.method('comparePassword', function (password: string): boolean {
//   if (bcrypt.compareSync(password, this.password)) return true
//   return false
// })

// userSchema.pre<IUser>(`save`, function (this: IUser, next) {
//   bcrypt.genSalt((err, salt) => {
//     bcrypt
//       .hash(this.password, salt)
//       .then((hash) => {
//         this.password = hash
//         next()
//       })
//       .catch((err) => console.log(err))
//   })
// })

// userSchema.static('hashPassword', (password: string): string => {
//   return bcrypt.hashSync(password)
// })

// export const User: IUserModel = model<IUser, IUserModel>('User', userSchema)

// export default User

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

UserSchema.pre<IUser>(`save`, function (this: IUser, next) {
  bcrypt.genSalt((err, salt) => {
    bcrypt
      .hash(this.password, salt)
      .then((hash) => {
        this.password = hash
        next()
      })
      .catch((err) => console.log(err))
  })
})

UserSchema.statics.login = async function (
  username: string,
  password: string
): Promise<IUser | null> {
  const user: IUser = this.findOne({ username })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    } else return null
  } else return null
}

// export const User: IUserModel = model<IUser, IUserModel>('User', UserSchema)
export default (models.User ||
  model<IUser, IUserModel>('User', UserSchema)) as IUserModel
// export default models.User || model<IUser, IUserModel>('User', UserSchema)
