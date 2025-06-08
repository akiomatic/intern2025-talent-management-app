import { SearchEmployees } from "../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talengine",
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
