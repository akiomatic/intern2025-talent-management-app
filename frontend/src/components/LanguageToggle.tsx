"use client";

import { IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { redirect, usePathname } from "@/i18n/navigation";
import { useState } from "react";

export function LanguageToggle() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const pathname = usePathname();
  
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleLanguageChange = (locale: string) => {
      redirect({ href: { pathname: pathname }, locale: locale });
    };

    return (
        <>
            <IconButton
            size="large"
            aria-label="language menu"
            aria-controls="language-menu"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
        >
            <LanguageIcon />
        </IconButton>
        <Menu
            id="language-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
            vertical: "top",
            horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={() => handleLanguageChange("ja")}>日本語</MenuItem>
            <MenuItem onClick={() => handleLanguageChange("en")}>English</MenuItem>
        </Menu>
      </>
    );
}