import { Session } from 'next-auth'
import { signout } from 'next-auth/client'
import { FC, ReactElement, useContext, useState } from 'react'

import {
  AppBar,
  Badge,
  Button,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core'
import {
  AccountCircleOutlined as AccountIcon,
  Menu as MenuIcon
} from '@material-ui/icons'
import { authContext, loadingContext } from '../provider/context'
import { IAuthContext, ILoadingContext } from '../provider'
import Router from 'next/router'
interface IHeader {
  session: Session | null | undefined
}

const useStyles = makeStyles({
  title: {
    marginRight: 'auto',
    cursor: 'pointer'
  }
})

const Header: FC<IHeader> = ({ session }): ReactElement => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { authState, setAuthState } = useContext(authContext) as IAuthContext
  const { setLoadingState } = useContext(loadingContext) as ILoadingContext
  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton>
          <MenuIcon style={{ color: 'white' }} />
        </IconButton>
        <Typography
          onClick={() => {
            setLoadingState(true)
            Router.push('/')
          }}
          className={classes.title}
        >
          E-Commerce
        </Typography>

        <Button
          aria-label='more'
          aria-controls='long-menu'
          aria-haspopup='true'
          onClick={(e) => {
            setAnchorEl(e.currentTarget)
          }}
          startIcon={<AccountIcon style={{ color: 'white' }} />}
        >
          {!!session && session?.user?.firstname}
          {!session && 'Account'}
        </Button>
        <Menu
          id='long-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          getContentAnchorEl={undefined}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {!!authState && (
            <div>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null)
                  setLoadingState(true)
                  Router.push('/bookmarked')
                }}
              >
                Bookmarked
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null)
                  setAuthState(false)
                  signout()
                }}
              >
                Logout
              </MenuItem>
            </div>
          )}
          {!authState && (
            <div>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null)
                  setLoadingState(true)
                  Router.push('/signin')
                }}
              >
                Login
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setLoadingState(true)
                  setAnchorEl(null)
                  Router.push('/new_user')
                }}
              >
                Register
              </MenuItem>
            </div>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header
