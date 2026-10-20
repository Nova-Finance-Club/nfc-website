"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig, type Article } from "@/lib/site-data";
import { useLanguage, useT } from "@/lib/language";

const fieldClasses =
  "mt-2 w-full rounded-md border border-brand-navy/25 bg-background px-4 py-3 text-base text-brand-navy outline-none placeholder:text-brand-navy/55 focus-visible:border-brand-navy focus-visible:ring-2 focus-visible:ring-brand-navy/20";
const labelClasses = "text-sm font-medium text-brand-navy";

// Comments on an article. There's no backend: the form opens the reader's
// email app with the comment addressed to the club (same as the contact
// form), and the club publishes the ones it approves by adding them to the
// article's `comments` in site-data.ts. Readers' emails are never shown.
export function ArticleComments({ article, title }: { article: Article; title: string }) {
  const t = useT();
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const comments = article.comments ?? [];

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(language === "pt" ? "pt-PT" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${iso}T00:00:00`));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`${t("comments.emailSubject", "Comment on")} "${title}"`);
    const body = encodeURIComponent(
      `${comment}\n\n${name} (${email})\n${window.location.href}`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="font-heading text-2xl font-bold tracking-normal">
          {t("comments.heading", "Comments")}
          {comments.length > 0 && (
            <span className="ml-2 font-normal text-muted-foreground">({comments.length})</span>
          )}
        </h2>

        {/* Approved comments, two to a row on wide screens. */}
        {comments.length > 0 ? (
          <ul className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {comments.map((c, i) => (
              <li key={i}>
                <p className="text-sm">
                  <span className="font-bold">{c.name}</span>
                  <span className="ml-2 text-muted-foreground">
                    <time dateTime={c.date}>{formatDate(c.date)}</time>
                  </span>
                </p>
                <p className="mt-2 leading-relaxed whitespace-pre-line text-foreground/85">{c.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-foreground/70">
            {t("comments.empty", "No comments yet. Be the first to share what you think.")}
          </p>
        )}

        {/* Full width: the comment box on the left, name, email and send
            beside it, so the form stays short. */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-lg border border-brand-navy/15 bg-brand-cream/30 p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="font-heading text-xl font-bold">{t("comments.formHeading", "Leave a comment")}</h3>
            <p className="text-sm text-foreground/75">
              {t(
                "comments.note",
                "Your email won't be published. Comments are reviewed before they appear here."
              )}
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-6">
            <div className="flex flex-col">
              <label htmlFor="comment-text" className={labelClasses}>
                {t("comments.comment", "Comment")} *
              </label>
              <textarea
                id="comment-text"
                name="comment"
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={`${fieldClasses} flex-1 resize-y`}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <label htmlFor="comment-name" className={labelClasses}>
                  {t("comments.name", "Name")} *
                </label>
                <input
                  id="comment-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClasses}
                />
              </div>
              <div>
                <label htmlFor="comment-email" className={labelClasses}>
                  {t("comments.email", "Email")} *
                </label>
                <input
                  id="comment-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClasses}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" size="lg" className="group active:scale-[0.98]">
              {t("comments.submit", "Send comment")}
              <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <p className="text-sm text-foreground/70" aria-live="polite">
              {sent
                ? t("comments.sent", "Your email app should open with the comment ready. Just press send.")
                : t("comments.howItWorks", "Opens your email app to send it.")}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
