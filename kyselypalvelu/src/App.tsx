import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import type { KyselyTyyppi } from './types'
import "./App.css"


function App() {
  const [kysely, setKysely] = useState<KyselyTyyppi[]>([]);
  const [kyselyt, setKyselyt] = useState<KyselyTyyppi[]>([]);

  return (
    <Container maxWidth="xl">
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Kyselypalvelu</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <nav>
            <NavLink style={({ isActive }) => ({ fontSize: '95%', margin: '20px', color: isActive ? "darkblue" : "white" })} to={"/"}>KOTI</NavLink>
            <NavLink style={({ isActive }) => ({ fontSize: '95%', margin: '20px', color: isActive ? "darkblue" : "white" })} to={"/kyselyt"}>KYSELYT</NavLink>
          </nav>
        </Toolbar>
      </AppBar>
      <Outlet context={{ kyselyt, setKyselyt, kysely, setKysely }} />
    </Container>
  )
}

export default App;