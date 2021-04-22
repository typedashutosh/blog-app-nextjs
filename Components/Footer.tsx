import { FC, ReactElement } from 'react'
import { AppBar, Container, Toolbar, Typography } from '@material-ui/core'

interface IFooter {}

const Footer: FC<IFooter> = ({}): ReactElement => {
  return (
    <AppBar position='static'>
      <Container>
        <Toolbar>
          <Typography>&copy; 2021 | typedashutosh</Typography>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Footer
