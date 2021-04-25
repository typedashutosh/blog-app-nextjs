import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { Account, Profile, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Providers from 'next-auth/providers'
import UserModel from '../../../models/User.model'
import dbConnect from '../../../utils/dbConnect'
import bcrypt from 'bcryptjs'

export default (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve) =>
    NextAuth(req, res, {
      providers: [
        Providers.Credentials({
          name: 'Credentials',
          credentials: {
            username: {
              label: 'Username',
              type: 'text',
              placeholder: 'Username'
            },
            password: {
              label: 'Password',
              type: 'text',
              placeholder: 'Password'
            }
          },
          authorize: async ({
            csrfToken,
            username,
            password
          }: Record<string, string>): Promise<User | null> => {
            dbConnect()
            return await UserModel.login(username, password)

            // const user: User | null = await UserModel.findOne({ username }, [
            //   'id',
            //   'firstname',
            //   'lastname',
            //   'username',
            //   'password'
            // ])

            // if (await bcrypt.compare('JohnDoe', String(user?.password))) {
            //   delete user?.password

            //   return user
            // } else return null
          }
        })
      ],
      session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
      },
      jwt: {
        maxAge: 24 * 60 * 60,
        encryption: true,
        secret: process.env.JWT_SECRET,
        signingKey: process.env.JWT_SIGNING_KEY,
        encryptionKey: process.env.JWT_ENCRYPTION_KEY
      },
      callbacks: {
        signIn: async (
          user: User,
          account: Account,
          profile: Profile
        ): Promise<string | boolean> => {
          return true
        },
        redirect: async (url: string, baseUrl: string): Promise<string> => {
          return url
        },
        session: async (
          session: Session,
          userOrToken: User | JWT
        ): Promise<Session> => {
          const returnSession = {
            expires: session.expires,
            user: {
              _id: userOrToken._id,
              firstname: userOrToken.firstname,
              lastname: userOrToken.lastname,
              username: userOrToken.username
            },
            accessToken: session.accessToken
          }
          return returnSession
        },
        jwt: async (
          token: JWT,
          user: User,
          account: Account,
          profile: Profile,
          isNewUser: boolean
        ): Promise<JWT> => {
          user &&
            (token = {
              _id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              username: user.username
            })
          return token
        }
      },
      pages: {
        signIn: '/signin',
        error: '/signin',
        signOut: '/'
      }
    })
  )
}
