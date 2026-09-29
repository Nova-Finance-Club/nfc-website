"use client";

import { Link } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/language";

export default function NotFound() {
  const t = useT();
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-28 text-center">
      <p className="font-heading text-7xl font-bold tracking-normal">&lt;404&gt;</p>
      <h1 className="mt-6 font-heading text-2xl font-bold tracking-normal">
        {t("notFound.heading", "This page doesn't exist.")}
      </h1>
      <p className="mt-2 text-foreground/70">
        {t("notFound.body", "It may have moved, or the link may be wrong.")}
      </p>
      <Button className="mt-8" nativeButton={false} render={<Link href="/" />}>
        {t("notFound.home", "Back to the homepage")}
      </Button>
    </section>
  );
}
