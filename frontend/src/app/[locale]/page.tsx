import { SearchEmployees } from "../../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/types/locale";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

interface GenerateMetadataProps {
  params: Promise<{ locale: Locale }>;
} 

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: `${t("global.title")} - ${t("page.home.title")}`,
  };
}
  
interface HomeProps {
    params: Promise<{ locale: Locale }>;
}

export default async function Home({
  params,
}: HomeProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "page.home" });
  
  return (
    <GlobalContainer
      pageTitle={t("title")}
      breadcrumbs={[{ label: "社員検索", icon: "🏠" }]}
      locale={locale}
    >
      <SearchEmployees />
    </GlobalContainer>
  );
}
