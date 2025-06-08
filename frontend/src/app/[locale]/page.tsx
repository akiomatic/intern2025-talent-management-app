import { SearchEmployees } from "../../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/types/locale";
import { routing } from "@/i18n/routing";
import { SERVICE_TITLE } from "@/app/const/service";

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
    title: `${SERVICE_TITLE} - ${t("page.home.title")}`,
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
      breadcrumbs={[{ label: t("title"), icon: "🏠" }]}
    >
      <SearchEmployees />
    </GlobalContainer>
  );
}
