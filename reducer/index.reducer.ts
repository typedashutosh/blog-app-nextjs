import { combineReducers } from 'redux'
import { userInfoReducer } from './user.reducers'
import { newBlogReducer } from './blog.reducer'

const allReducers = combineReducers({
  userInfoState: userInfoReducer,
  newBlogState: newBlogReducer,
})

export default allReducers
