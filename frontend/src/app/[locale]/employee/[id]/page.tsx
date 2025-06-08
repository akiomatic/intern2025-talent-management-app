import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/types/locale";

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
    <GlobalContainer pageTitle={t("title")} locale={locale}>
      {/* Mark EmployeeDetailsContainer as CSR */}
      <Suspense>
        <EmployeeDetailsContainer />
      </Suspense>
    </GlobalContainer>
  );
}
