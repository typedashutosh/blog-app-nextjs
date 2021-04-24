import { Session } from 'next-auth'
import { signout } from 'next-auth/client'
import Link from 'next/link'
import { FC, ReactElement, useContext, useState } from 'react'

import {
  AppBar,
  Badge,
  Button,
  IconButton,
  LinearProgress,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core'
import {
  AccountCircleOutlined as AccountIcon,
  Menu as MenuIcon,
  ShoppingCartOutlined as CartIcon
} from '@material-ui/icons'

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

  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton>
          <MenuIcon style={{ color: 'white' }} />
        </IconButton>
        <Link href='/'>
          <Typography className={classes.title}>E-Comm</Typography>
        </Link>

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
          {!!session && (
            <div>
              <Link href='/settings'>
                <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
              </Link>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null)
                  signout()
                }}
              >
                Logout
              </MenuItem>
            </div>
          )}
          {!session && (
            <div>
              <Link href='/signin'>
                <MenuItem onClick={() => setAnchorEl(null)}>Login</MenuItem>
              </Link>
              <Link href='/new_user'>
                <MenuItem onClick={() => setAnchorEl(null)}>Register</MenuItem>
              </Link>
            </div>
          )}
        </Menu>
        {/* {!!session && true} */}
      </Toolbar>
    </AppBar>
  )
}

export default Header
