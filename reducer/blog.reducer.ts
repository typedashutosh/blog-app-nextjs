import { newBlogAction, newBlogProps } from '../actions/blog.action'

const initialNewBlogState: newBlogProps = {
  blogID: '',
  _event: 'DELETED'
}

export const newBlogReducer = (
  state: newBlogProps = initialNewBlogState,
  action: newBlogAction
) => {
  switch (action.type) {
    case 'CREATED':
      return (state = {
        blogID: action.payload.blogID,
        _event: 'CREATED'
      })
    case 'DELETED':
      return (state = {
        blogID: action.payload.blogID,
        _event: 'DELETED'
      })
    default:
      return state
  }
}
