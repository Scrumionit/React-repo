import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Box, Button } from '@mui/material'
import type { Kysely } from './types'
import HHlogo from './assets/HHlogo.png'
// import "./App.css"


function App() {
  const [kysely, setKysely] = useState<Kysely[]>([]);
  const [kyselyt, setKyselyt] = useState<Kysely[]>([]);

  return (
    <Container maxWidth="xl">
      <CssBaseline />

      <AppBar sx={{
        position: "static", background: "linear-gradient(90deg, #0079c2 0%, #18b89e 100%)",
        boxShadow: 3,
        borderRadius: 2,
        marginBottom: 4,
        marginTop: 1.5,
      }}>

        <Toolbar>
          <Button component={NavLink} to="/">
            <img
              src={HHlogo}
              alt="Haaga-Helia logo"
              style={{ height: 70, padding: 8, marginRight: 10 }}
            />
          </Button>

          <Typography variant="h6" sx={{position: "absolute", left: "50%", transform: "translateX(-50%)", fontWeight: "bold"}}>Haaga-Helian Kyselypalvelu</Typography>

          <Box sx={{ flexGrow: 1 }} />
          <nav>
            <Button component={NavLink} to="/"
              sx={{
                color: "white",
                fontSize: "105%",
                "&.active": {
                  color: "#0166a5ff",
                },
                "&:hover": {
                  color: "#005565ff",
                },
              }}
            >KOTI</Button>

            <Button component={NavLink} to="/kyselyt"
              sx={{
                color: "white",
                fontSize: "105%",
                marginLeft: 1,
                "&.active": {
                  color: "#0166a5ff",
                },
                "&:hover": {
                  color: "#005565ff",
                },
              }}
            >KYSELYT</Button>
          </nav>

        </Toolbar>
      </AppBar>
      <Outlet context={{ kyselyt, setKyselyt, kysely, setKysely }} />
    </Container>
  )
}

export default App;