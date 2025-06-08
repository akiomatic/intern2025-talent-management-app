import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "@/i18n/navigation";

export interface GlobalHeaderProps {
  title: string;
  pageTitle?: string;
}

export function GlobalHeader({ title, pageTitle }: GlobalHeaderProps) {
  const displayTitle = pageTitle ? `${title} - ${pageTitle}` : title;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          variant="dense"
          sx={{
            background:
              "linear-gradient(45deg, rgb(0, 91, 172), rgb(94, 194, 198))",
          }}
        >
          <Link href="/">
            <PeopleIcon fontSize={"large"} sx={{ mr: 2 }} />
          </Link>
          <Link href="/">
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              {displayTitle}
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
