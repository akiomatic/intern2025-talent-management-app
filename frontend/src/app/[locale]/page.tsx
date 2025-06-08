import { SearchEmployees } from "../../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface GenerateMetadataProps {
  params: Promise<{ locale: typeof routing.locales[number] }>;
} 

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "page.home" });

  return {
    title: t("title"),
  };
}
  
interface HomeProps {
  params: Promise<{ locale: typeof routing.locales[number] }>;
}

export default async function Home({
  params,
}: HomeProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "page.home" });
  return (
    <GlobalContainer pageTitle={t("title")} locale={locale}>
      <SearchEmployees />
    </GlobalContainer>
  );
}
