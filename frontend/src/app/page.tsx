import { SearchEmployees } from "../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import type { Metadata } from "next";
import { SERVICE_TITLE } from "@/app/const/service";

export const metadata: Metadata = {
  title: "${SERVICE_TITLE} - 社員詳細",
};

export default function Home() {
  return (
    <GlobalContainer
      pageTitle="社員検索"
      breadcrumbs={[{ label: "社員検索", icon: "🏠" }]}
    >
      <SearchEmployees />
    </GlobalContainer>
  );
}
