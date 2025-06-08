import { Container } from "@mui/material";
import { VerticalSpacer } from "../components/VerticalSpacer";
import { GlobalHeader } from "../components/GlobalHeader";
import { GlobalFooter } from "../components/GlobalFooter";
import React from "react";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

interface GlobalContainerProps {
  children?: React.ReactNode;
  pageTitle?: string;
  locale: typeof routing.locales[number];
}

export async function GlobalContainer({ children, pageTitle, locale }: GlobalContainerProps) {
  const t = await getTranslations({ locale, namespace: "global" });
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header>
        <GlobalHeader
          title={t("title")}
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
