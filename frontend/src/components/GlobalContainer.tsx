import { Container } from "@mui/material";
import { VerticalSpacer } from "../components/VerticalSpacer";
import { GlobalHeader } from "../components/GlobalHeader";
import { GlobalFooter } from "../components/GlobalFooter";
import React from "react";
import { Locales } from "@/const/locales";
import { getTranslations } from "@/app/[lang]/translations";

interface GlobalContainerProps {
  children?: React.ReactNode;
  pageTitle?: string;
  lang: Locales;
}

export async function GlobalContainer({ children, pageTitle, lang }: GlobalContainerProps) {
  const { global } = await getTranslations(lang);
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header>
        <GlobalHeader
          title={global.title}
          pageTitle={pageTitle}
        />
      </header>

      <VerticalSpacer height={32} />

      <main>{children}</main>

      <footer>
        <GlobalFooter />
      </footer>
    </Container>
  );
}
