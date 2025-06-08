import { defineRouting } from "next-intl/routing";
import { LOCALES } from "@/const/locales";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "ja",
});
