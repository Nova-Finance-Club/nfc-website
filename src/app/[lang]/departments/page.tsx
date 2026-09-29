import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { langFrom, pageMetadata } from "@/lib/seo";
import { DepartmentsContent } from "./departments-content";

export async function generateMetadata({ params }: PageProps<"/[lang]/departments">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  return pageMetadata(lang, "/departments", {
    title: "Departments",
    titleKey: "meta.departments.title",
    descriptionKey: "meta.departments.description",
    description:
      "Nova Finance Club's governance and its four departments: Investments, Quantitative Trading, Personal Finance, and Events & External Relations.",
  });
}

export default function Page() {
  return (
    <PageTransition>
      <DepartmentsContent />
    </PageTransition>
  );
}
