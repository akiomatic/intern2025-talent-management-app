import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from "react";
import type { Metadata } from "next";
import { SERVICE_TITLE } from "@/app/const/service";

export const metadata: Metadata = {
  title: "SERVICE_TITLE - 社員詳細",
};

export default function EmployeePage() {
  return (
    <GlobalContainer
      pageTitle="社員詳細"
      breadcrumbs={[
        { label: "社員検索", href: "/", icon: "🏠" },
        { label: "社員詳細" },
      ]}
    >
      {/* Mark EmployeeDetailsContainer as CSR */}
      <Suspense>
        <EmployeeDetailsContainer />
      </Suspense>
    </GlobalContainer>
  );
}
