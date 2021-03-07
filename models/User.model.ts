import { Document, model, Schema, models } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  firstname: string
  lastname?: string
  username: string
  password: string
}

const UserSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: [true, 'Firstname is required'] },
    lastname: String,
    username: {
      type: String,
      unique: true,
      required: [true, 'Please provide a username']
    },
    password: { type: String, required: [true, 'Please provide a Password'] }
  },
  { timestamps: true }
)

UserSchema.pre<IUser>(`save`, function (this: IUser, next) {
  bcrypt
    .genSalt()
    .then((salt) => {
      bcrypt.hash(this.password, salt).then((hash) => {
        this.password = hash
        next()
      })
    })
    .catch((err) => console.log(err))
})

export default models.User || model<IUser>('User', UserSchema)
