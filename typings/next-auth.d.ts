import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: {
      _id: string
      firstname: string
      lastname?: string
      username: string
    }
  }
  interface User {
    _id: string
    firstname: string
    lastname?: string
    username: string
  }
}

declare module 'next-auth/jwt' {
  //   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    _id: string
    firstname: string
    lastname?: string
    username: string
  }
}
