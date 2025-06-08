import { getTranslations } from "@/app/[lang]/translations";
import { SearchEmployees } from "../../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Locales } from "@/const/locales";
import type { Metadata } from "next";

interface GenerateMetadataProps {
  params: Promise<{ lang: Locales }>;
} 

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { page } = await getTranslations((await params).lang);
  return {
    title: page.home.title,
  };
}

export default function Home() {
  return (
    <GlobalContainer pageTitle="社員検索">
      <SearchEmployees />
    </GlobalContainer>
  );
}
