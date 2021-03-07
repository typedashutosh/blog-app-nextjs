export type newBlogProps = {
  blogID: string
  _event: 'CREATED' | 'DELETED'
}

export type newBlogAction = {
  type: 'CREATED' | 'DELETED'
  payload: {
    blogID: string
  }
}

export const newBlogAction = ({
  blogID,
  _event
}: newBlogProps): newBlogAction => {
  switch (_event) {
    case 'CREATED':
      return {
        type: 'CREATED',
        payload: {
          blogID
        }
      }
    case 'DELETED':
      return {
        type: 'DELETED',
        payload: {
          blogID
        }
      }
  }
}
