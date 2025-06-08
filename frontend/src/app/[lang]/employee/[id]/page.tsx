import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Locales } from "@/const/locales";
import { getTranslations } from "@/app/[lang]/translations";

interface GenerateMetadataProps {
  params: Promise<{ lang: Locales }>;
} 

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { page } = await getTranslations((await params).lang);
  return {
    title: page.employee.title,
  };
}

interface EmployeePageProps {
  params: Promise<{ lang: Locales }>;
}

export default async function EmployeePage({ params }: EmployeePageProps) {
  const { page } = await getTranslations((await params).lang);
  return (
    <GlobalContainer pageTitle={page.employee.title}>
      {/* Mark EmployeeDetailsContainer as CSR */}
      <Suspense>
        <EmployeeDetailsContainer />
      </Suspense>
    </GlobalContainer>
  );
}
