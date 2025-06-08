import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
    title: `${t("global.title")} - ${t("page.employee.title")}`,
  };
}

interface EmployeePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function EmployeePage({
  params, 
}: EmployeePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "page.employee" });
  return (
    <GlobalContainer
      pageTitle={t("title")}
      breadcrumbs={[
        { label: "社員検索", href: "/", icon: "🏠" },
        { label: "社員詳細" },
      ]}
      locale={locale}
    >
      {/* Mark EmployeeDetailsContainer as CSR */}
      <Suspense>
        <EmployeeDetailsContainer />
      </Suspense>
    </GlobalContainer>
  );
}
