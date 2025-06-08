import { Container } from "@mui/material";
import { VerticalSpacer } from "../components/VerticalSpacer";
import { GlobalHeader } from "../components/GlobalHeader";
import { GlobalFooter } from "../components/GlobalFooter";
import React from "react";
// import { Link as MuiLink } from "@mui/material";
import Link from "next/link";
// import HomeIcon from "@mui/icons-material/Home";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface GlobalContainerProps {
  children?: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  locale: typeof routing.locales[number];
}

export async function GlobalContainer({
  children,
  pageTitle,
  breadcrumbs,
  locale,
}: GlobalContainerProps) {
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

      {/* パンくずリスト */}
      {breadcrumbs && (
        <div style={{ margin: "16px" }}>
          {breadcrumbs.map((item, index) => (
            <span key={index}>
              {item.href ? (
                <Link href={item.href}>
                  {item.icon} {item.label}
                </Link>
              ) : (
                <span>
                  {item.icon} {item.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && " > "}
            </span>
          ))}
        </div>
      )}

      <VerticalSpacer height={32} />

      <main>{children}</main>

      <footer>
        <GlobalFooter />
      </footer>
    </Container>
  );
}
