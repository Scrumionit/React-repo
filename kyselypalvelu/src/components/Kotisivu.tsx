import { Box, Button, Paper } from "@mui/material";
import { NavLink } from "react-router";

function Kotisivu() {
  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="70vh">
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <h2>Tervetuloa Haaga-Helian kyselypalveluun!</h2>
        </Paper>

        <Button component={NavLink} to="/kyselyt" variant="contained" sx={{ backgroundColor: "#18b89e", marginTop: 4 }}>
          Siirry kyselyihin
        </Button>

      </Box>
    </>
  );
}

export default Kotisivu;