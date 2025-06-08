import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Locales } from "@/const/locales";
import { getTranslations } from "next-intl/server";

interface GenerateMetadataProps {
  params: Promise<{ locale: Locales }>;
} 

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'page.employee' });
  
  return {
    title: t("title"),
  };
}

export default async function EmployeePage() {
  const t = await getTranslations("page.employee");
  return (
    <GlobalContainer pageTitle={t("title")}>
      {/* Mark EmployeeDetailsContainer as CSR */}
      <Suspense>
        <EmployeeDetailsContainer />
      </Suspense>
    </GlobalContainer>
  );
}
