import { SearchEmployees } from "../../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Locales } from "@/const/locales";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface GenerateMetadataProps {
  params: Promise<{ locale: Locales }>;
} 

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.home' });

  return {
    title: t("title"),
  };
}

export default async function Home() {
  const t = await getTranslations("page.home");
  return (
    <GlobalContainer pageTitle={t("title")}>
      <SearchEmployees />
    </GlobalContainer>
  );
}
