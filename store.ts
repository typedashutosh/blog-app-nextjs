import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import allReducers from './reducer/index.reducer'

export const store = createStore(allReducers, composeWithDevTools(applyMiddleware()))