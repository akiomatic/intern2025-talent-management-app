import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "タレントマネジメントシステム - 社員詳細",
};

export default function EmployeePage() {
  return (
    <GlobalContainer>
      {/* Mark EmployeeDetailsContainer as CSR */}
      <Suspense>
        <EmployeeDetailsContainer />
      </Suspense>
    </GlobalContainer>
  );
}
