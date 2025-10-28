import './App.css'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Link, Outlet } from 'react-router'

export default function App() {
  return (
    <>
      <Container maxWidth="lg">
          <AppBar position="static" sx={{marginBottom: 1}}>
            <Toolbar>
              <Typography variant="h5">Kyselypalvelu</Typography>
            </Toolbar>
          </AppBar>
          <nav>
            <Link to={"/"}> Home </Link>
          </nav>
          <CssBaseline />
          <Outlet context={{}}/>
      </Container>
    </>
  )
}
