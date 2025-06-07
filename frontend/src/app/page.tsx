import { SearchEmployees } from "../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "タレントマネジメントシステム - 社員検索",
};

export default function Home() {
  return (
    <GlobalContainer>
      <SearchEmployees />
    </GlobalContainer>
  );
}
