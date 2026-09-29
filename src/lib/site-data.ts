// Central content source for the NFC V0 site.
// Every fact here comes from the "NOVA FINANCE CLUB — Estrutura e Pessoas — Mandato 2026/2027"
// brief, or was supplied directly by the user in chat. Nothing here is invented.

export const siteConfig = {
  // Public origin, used for canonical URLs, hreflang, the sitemap and share
  // previews. Set NEXT_PUBLIC_SITE_URL in Vercel once the club's own domain
  // is live — no code change needed.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://novafinanceclub.vercel.app",
  name: "Nova Finance Club",
  shortName: "NFC",
  institution: "NOVA FCT",
  institutionFullName: "NOVA School of Science and Technology",
  slogan: "Bridging Science & Finance",
  foundedYear: 2024,
  mandate: "2026/2027",
  memberCount: 27,
  email: "nfc@ae.fct.unl.pt",
  instagram: "https://www.instagram.com/novafinanceclub_fct/",
  linkedin: "https://www.linkedin.com/company/nova-finance-club/",
  github: "https://github.com/NOVA-Finance-Club",
};

export const missionStatement = `Founded in ${siteConfig.foundedYear}, the ${siteConfig.name} is a student-led organization at the ${siteConfig.institutionFullName}. Our mission is to foster financial literacy, ignite interest in financial markets, and equip students with practical skills.`;

// The club's founding story, written by the user for the About page, split
// into the beats the page's layout uses (hero statement, the gap, mission,
// background, the community it wants to be). English here is a
// translation; the Portuguese original lives in translations-pt.ts under
// the matching "about.*" keys.
//
// NOTE ON gapStatCaption: this Portugal claim (engineering as the 2nd most
// common degree among people in leadership roles, right behind Gestão) is
// supplied by the user directly — unlike the earlier U.S. Data USA figure
// it replaced, no independent source has been found or verified for it.
// Flag before reusing or presenting this number as sourced.
export const aboutStory = {
  heroHeadline: "There's a real gap in how science and engineering students are trained.",
  heroSubtext: "Nova Finance Club started from that observation.",
  gapBody:
    "Many scientists and engineers, as their careers progress, take on roles in management, finance or leadership, where this knowledge becomes essential.",
  gapStatNumber: "2nd",
  gapStatCaption: "Engineering is the second most common degree among people in leadership positions in Portugal, right behind Management.",
  missionHeading: "Mission",
  aboutMission:
    "Our mission is simple: foster financial literacy, spark real interest in the markets, and build the practical skills students actually need.",
  membersHeading: "Members",
  aboutMembersLead: "Our {memberCount} members come from {distinctBackgrounds} different academic backgrounds, including:",
  backgroundHeading: "Background",
  aboutBackground:
    "Nova Finance Club launched in 2024 at NOVA School of Science and Technology. Since then it has grown into four departments (Investments, Quantitative Trading, Personal Finance, and Events & External Relations), run by an elected Board and General Council.",
  communityLead:
    "NFC isn't just an academic club. It's a community built on members helping each other out. We believe bringing together people with different backgrounds and interests means everyone comes out ahead.",
  communityExperienced: "Those with more experience help the ones just starting out.",
  communityNewcomers: "Newcomers bring fresh energy and a different point of view.",
};

export const navItems = [
  { label: "About Us", href: "/about" },
  { label: "Departments", href: "/departments" },
  { label: "Alumni", href: "/alumni" },
  { label: "Articles", href: "/articles" },
  { label: "Fund", href: "/fund" },
  { label: "Partners", href: "/partners" },
  { label: "Join", href: "/join" },
] as const;

export type Person = { role: string; name: string };

// Member photos, keyed by name — same lookup pattern as memberDegrees below.
// Empty until real photos exist ("reserved, not faked": PersonCard falls
// back to an initials tile for anyone missing here). Every current member
// already has their own empty folder under public/members/<slug>/ (e.g.
// public/members/sara-abrantes/) — to add a photo, drop the file in there
// and add one line here pointing at it, e.g.
// "Sara Abrantes": "/members/sara-abrantes/photo.jpg".
export const memberPhotos: Record<string, string> = {
  "Sara Abrantes": "/members/sara-abrantes/IMG_5926.JPG",
  "Diogo Ruivo": "/members/diogo-ruivo/IMG_5947.JPG",
  "João Henriques": "/members/joao-henriques/IMG_5924.JPG",
  "Gisela Alves": "/members/gisela-alves/IMG_5929.JPG",
  "Gonçalo Vieira": "/members/goncalo-vieira/IMG_5901.JPG",
  "Isabel Monteiro": "/members/isabel-monteiro/IMG_5904.JPG",
  "José Seixas da Fonseca": "/members/jose-seixas-da-fonseca/IMG_5908.JPG",
  "Maria Neves": "/members/maria-neves/IMG_5922.JPG",
  "Marta Jesus": "/members/marta-jesus/IMG_5935.JPG",
  "Matilde Duarte": "/members/matilde-duarte/IMG_5919.JPG",
  "Rodrigo Devesa": "/members/rodrigo-devesa/IMG_5937.JPG",
  "Samuel Pires Gonçalves": "/members/samuel-pires-goncalves/IMG_6001.JPG",
  "Tiago Albuquerque": "/members/tiago-albuquerque/IMG_5998.JPG",
  "Vasco Cruz": "/members/vasco-cruz/IMG_5909.JPG",
};

// Member LinkedIn profiles, keyed by name — same lookup pattern as
// memberPhotos above. Canonical profile URLs only (LinkedIn's own
// tracking query params — miniProfileUrn, lipi — stripped, since those
// are session-specific to whoever copied the link, not stable).
export const memberLinkedIn: Record<string, string> = {
  "Sara Abrantes": "https://www.linkedin.com/in/sara-abrantes-49b69a38a/",
  "Diogo Ruivo": "https://www.linkedin.com/in/diogoruivo1/",
  "João Henriques": "https://www.linkedin.com/in/jmhenriques/",
  "Isabel Monteiro": "https://www.linkedin.com/in/isabelmonteiro05/",
  "José Seixas da Fonseca": "https://www.linkedin.com/in/jos%C3%A9-seixas-fonseca/",
  "Maria Neves": "https://www.linkedin.com/in/maria-luis-21a8972a5/",
  "Matilde Duarte": "https://www.linkedin.com/in/matilde-duarte-b11726438/",
  "Rodrigo Devesa": "https://www.linkedin.com/in/rodrigo-devesa-050a652bb/",
  "Samuel Pires Gonçalves": "https://www.linkedin.com/in/samuel-pires-gon%C3%A7alves-324640282/",
  "Duarte Esteves": "https://www.linkedin.com/in/duartedesteves/",
  "Filipe Parreira": "https://www.linkedin.com/in/filipeparreira/",
  "Guilherme Tenório": "https://www.linkedin.com/in/guilherme-setas-ten%C3%B3rio-31034b219/",
  "Afonso Jerónimo": "https://www.linkedin.com/in/afonso-jer%C3%B3nimo-4b24173b9/",
  "Vasco Cruz": "https://www.linkedin.com/in/vasco-cruz-871b02237/",
  "Tiago Albuquerque": "https://www.linkedin.com/in/tiago-albuquerque-70742630b/",
  "Guilherme Azevedo": "https://www.linkedin.com/in/gazevedov/",
  "Mateo Kirk": "https://www.linkedin.com/in/mateo-mara%C3%B1on-088704297/",
  "Joana Ferreira": "https://www.linkedin.com/in/joana-mesquita-7547aa356/",
  "Tiago Santos": "https://www.linkedin.com/in/tiago-neto-santos/",
};

// Cropping a landscape photo into the card's portrait tile only shows a
// vertical slice of it — a plain center crop reproduces however far
// off-centered the subject happened to be in the original shot, not
// necessarily centered in the crop. Optional per-person override (CSS
// object-position, e.g. "63% center") for anyone whose default 50%/50%
// crop doesn't land on them; measured against the actual rendered crop,
// not just eyeballed. Omit for photos that are already centered as-is.
export const memberPhotoPosition: Record<string, string> = {
  "Sara Abrantes": "52% center",
  "Diogo Ruivo": "42% center",
  "João Henriques": "47% center",
  "Gisela Alves": "54% center",
  "Gonçalo Vieira": "48% center",
  "José Seixas da Fonseca": "46% center",
  "Maria Neves": "45% center",
  "Matilde Duarte": "45% center",
  "Samuel Pires Gonçalves": "52% center",
  "Tiago Albuquerque": "53% center",
};

// Academic programme per member, from Data/NFC_Membros_2026-2027.csv.
// Level (BSc/MSc) is derived from the course's own full name ("Licenciatura"
// vs "Mestrado") rather than the CSV's separate Nível column, because that
// column disagrees with the course name for 3 people (Gisela Alves,
// Guilherme Tenório, Bernardo Barata) — flagged for the user to verify.
export type Degree = { code?: string; name: string; level: "BSc" | "MSc" };

export const memberDegrees: Record<string, Degree> = {
  "Sara Abrantes": { name: "Actuarial Mathematics", level: "MSc" },
  "Diogo Ruivo": { code: "LMAGR", name: "Applied Mathematics for Risk Management", level: "BSc" },
  "João Henriques": { code: "LEI", name: "Computer Engineering", level: "BSc" },
  "Samuel Pires Gonçalves": { code: "MEG", name: "Geological Engineering", level: "MSc" },
  "Duarte Esteves": { code: "LEGI", name: "Industrial Engineering and Management", level: "BSc" },
  "Tiago Santos": { code: "MEI", name: "Computer Engineering", level: "MSc" },
  "Rodrigo Devesa": { code: "LEEC", name: "Electrical and Computer Engineering", level: "BSc" },
  "Joana Ferreira": { code: "MMA", name: "Mathematics and Applications", level: "MSc" },
  "Gisela Alves": { code: "MMA", name: "Mathematics and Applications", level: "MSc" },
  "Tiago Albuquerque": { code: "LMAGR", name: "Applied Mathematics for Risk Management", level: "BSc" },
  "Marta Jesus": { code: "MMA", name: "Mathematics and Applications", level: "MSc" },
  "Isabel Monteiro": { name: "Actuarial Mathematics", level: "MSc" },
  "Filipe Parreira": { code: "LEGI", name: "Industrial Engineering and Management", level: "BSc" },
  "Gonçalo Vieira": { code: "LMAGR", name: "Applied Mathematics for Risk Management", level: "BSc" },
  "Rita Almeida": { code: "BQ", name: "Biochemistry", level: "BSc" },
  "Guilherme Tenório": { code: "LEGI", name: "Industrial Engineering and Management", level: "BSc" },
  "Bernardo Barata": { code: "MEI", name: "Computer Engineering", level: "MSc" },
  "Miguel Maria": { code: "LEB", name: "Biomedical Engineering", level: "BSc" },
  "José Seixas da Fonseca": { code: "LMAGR", name: "Applied Mathematics for Risk Management", level: "BSc" },
  "Mateo Kirk": { code: "LMAGR", name: "Applied Mathematics for Risk Management", level: "BSc" },
  "José Faria": { code: "LEEC", name: "Electrical and Computer Engineering", level: "BSc" },
  "Guilherme Azevedo": { code: "MEGI", name: "Industrial Engineering and Management", level: "MSc" },
  "Rogério Soares": { code: "MEI", name: "Computer Engineering", level: "MSc" },
  "Afonso Jerónimo": { code: "LMAGR", name: "Applied Mathematics for Risk Management", level: "BSc" },
  "Matilde Duarte": { code: "LMAGR", name: "Applied Mathematics for Risk Management", level: "BSc" },
  "Vasco Cruz": { code: "LMAGR", name: "Applied Mathematics for Risk Management", level: "BSc" },
  "Maria Neves": { name: "Big Data Analytics and Engineering", level: "MSc" },
};

export const board: Person[] = [
  { role: "President", name: "Sara Abrantes" },
  { role: "Vice President", name: "Diogo Ruivo" },
  { role: "Secretary-General", name: "João Henriques" },
];

export const generalAssemblyBoard: Person[] = [
  { role: "President", name: "Samuel Pires Gonçalves" },
  { role: "Vice President", name: "Duarte Esteves" },
  { role: "Secretary", name: "Tiago Santos" },
];

export const fiscalCouncil: Person[] = [
  { role: "President", name: "Rodrigo Devesa" },
  { role: "Vice President", name: "Joana Ferreira" },
];

// Governance bodies, presented on /departments alongside the four functional
// departments. The General Council is the General Assembly Board and the
// Fiscal Council together — not a third, separate body.
export type GovernanceUnit = {
  slug: string;
  name: string;
  badgeImage: string;
  // One-liner, used only on the /departments index cards. The detail page
  // shows `description` alone, same convention as Department below.
  summary: string;
  description?: string;
  // Hero photo. This unit already has its own empty folder at
  // public/departments/<slug>/ — drop the file in there and point this at
  // it, e.g. "/departments/board/photo.jpg". Undefined shows the reserved
  // dashed placeholder instead (see PhotoPlaceholder in detail-content.tsx).
  photo?: string;
  people?: Person[];
  subgroups?: { title: string; people: Person[] }[];
};

export type EditorialSeries = {
  name: string;
  englishGloss?: string;
  cadence: string;
  description: string;
};

export type Division = {
  name: string;
  description: string;
};

export type Department = {
  slug: string;
  name: string;
  formerly?: string;
  coordinator: string;
  members: string[];
  // One-liner, used only on the /departments index cards. The detail page
  // shows `description` alone — it already folds the summary in, so printing
  // both there would repeat the same sentence twice.
  summary: string;
  description?: string;
  mandateGoal?: string;
  editorialSeries?: EditorialSeries[];
  divisions?: Division[];
  notes?: string[];
  // The department's own colour, sampled from its badge — used for hover
  // accents (underline, border) wherever the department is listed.
  accent: string;
  badgeImage: string;
  // Public code repository, when the department keeps one.
  repo?: string;
  // Team photo. This department already has its own folder at
  // public/departments/<slug>/ — drop the file in there and point this at
  // it. Only rendered once SHOW_DEPARTMENT_PHOTOS below is switched on.
  photo?: string;
};

// Department pages hide their hero photo slot until every department has a
// group photo, so no page looks unfinished next to another. Flip to true
// once all four `photo` fields are set. Governance pages (Board, General
// Council) show their photo whenever one exists and never a placeholder.
export const SHOW_DEPARTMENT_PHOTOS = false;

export const departments: Department[] = [
  {
    slug: "investment",
    name: "Investments Department",
    coordinator: "Rodrigo Devesa",
    members: [
      "Guilherme Tenório",
      "Bernardo Barata",
      "Miguel Maria",
      "José Seixas da Fonseca",
      "Mateo Kirk",
      "José Faria",
    ],
    summary: "Runs the club's virtual investment fund and covers global capital markets.",
    description:
      "Manages NFC's virtual investment fund and keeps the club connected to global capital markets, giving members hands-on experience with real portfolio decisions and market analysis.",
    divisions: [
      {
        name: "Division 01 — Asset Management",
        description:
          "Runs a virtual fund with an initial allocation set at the start of the mandate, split into coverage teams (e.g. Iberia & Europe, Emerging Markets, Global Macro), each managing its own portion of the fund, and produces the quarterly NFC Performance Report on LinkedIn.",
      },
      {
        name: "Division 02 — Global Markets & Markets Overview",
        description:
          "Publishes a short weekly report on capital markets performance (yields, commodities, FX) with a recap of the week's key events.",
      },
    ],
    accent: "#375d3d",
    badgeImage: "/brand/dept-investimentos.png",
  },
  {
    slug: "quantitative-trading",
    name: "Quantitative Trading Department",
    formerly: "Innovative Trading",
    coordinator: "Diogo Ruivo",
    members: [
      "Guilherme Azevedo",
      "Rogério Soares",
      "Afonso Jerónimo",
      "Matilde Duarte",
      "Vasco Cruz",
      "João Henriques",
      "Maria Neves",
      "Joana Ferreira",
    ],
    summary: "Builds quantitative finance projects with real market data, across three divisions.",
    description:
      "Builds quantitative finance projects with real market data, from systematic strategies to portfolio optimisation and alternative data. Members start with the Quant Crash Course, a short introduction to each of the department's three divisions, then work on projects within their division, delivered as Jupyter notebooks and presented to the department.",
    divisions: [
      {
        name: "Division 01 — Signal Research",
        description:
          "Systematic trading strategies and machine learning: finding signals in market data and testing whether they hold up out of sample.",
      },
      {
        name: "Division 02 — Portfolio & Risk",
        description:
          "Portfolio construction and risk management with optimisation-based methods, always measured against a benchmark.",
      },
      {
        name: "Division 03 — Sentiment & Alternative Data",
        description:
          "Natural language processing and alternative data sources, turning text and other non-traditional data into measurable signals.",
      },
    ],
    repo: "https://github.com/NOVA-Finance-Club/Quant-Trading-Concepts",
    accent: "#33456b",
    badgeImage: "/brand/dept-quant.png",
  },
  {
    slug: "personal-finance",
    name: "Personal Finance Department",
    coordinator: "Isabel Monteiro",
    members: ["Filipe Parreira", "Gonçalo Vieira", "Rita Almeida"],
    summary:
      "Makes economics and personal finance accessible to the NOVA FCT community, through regular editorial series.",
    description:
      "Makes economics and personal finance accessible to the NOVA FCT community and on LinkedIn, through three regular editorial series. Produces educational content that makes economics and personal finance accessible to a non-specialist audience, and covers European Central Bank policy decisions as they happen.",
    editorialSeries: [
      {
        name: "Economia numa Imagem",
        englishGloss: "The Economy in One Image",
        cadence: "Fortnightly",
        description:
          "A chart or statistic that tells an economic story, with minimal text.",
      },
      {
        name: "O Segredo dos Números",
        englishGloss: "The Secret of the Numbers",
        cadence: "Fortnightly",
        description:
          "A short, accessible analysis of a single economic statistic.",
      },
      {
        name: "European Monetary Policy",
        cadence: "About 8 times a year",
        description:
          "Published one week after each European Central Bank (ECB) meeting: the rate decision, its rationale, and euro-area inflation and growth data.",
      },
    ],
    accent: "#af7d38",
    badgeImage: "/brand/dept-financas-pessoais.png",
  },
  {
    slug: "events-external-relations",
    name: "Events & External Relations Department",
    formerly: "Marketing & Operations",
    coordinator: "Gisela Alves",
    members: ["Tiago Albuquerque", "Marta Jesus"],
    summary:
      "Runs the club's events, its recruitment campaign, and its external relationships.",
    description:
      "Plans and runs NFC's events, from internal socials and onboarding ceremonies to external panels and masterclasses with guests from the financial sector. Also leads the semesterly recruitment campaign, manages relationships with partners and sponsors, and coordinates with other national finance clubs.",
    mandateGoal: "1,000 LinkedIn followers by the end of the 2026/2027 mandate.",
    accent: "#5c2331",
    badgeImage: "/brand/dept-eventos-re.png",
    photo: "/departments/events-external-relations/IMG_5954.JPG",
  },
];

// Department coordinators, listed together on the Board page alongside the
// elected officers. Role labels include the department name so PeopleGrid's
// lead-role featuring (which matches on the exact role string "Coordinator")
// doesn't single one out — they're peers here, not a department's own lead.
export const departmentCoordinators: Person[] = departments.map((dept) => ({
  role: `${dept.name.replace(/ Department$/, "")} Coordinator`,
  name: dept.coordinator,
}));

export const governanceUnits: GovernanceUnit[] = [
  {
    slug: "board",
    name: "Board",
    badgeImage: "/brand/dept-direcao.png",
    summary:
      "The club's elected executive leadership for the 2026/2027 mandate.",
    description:
      "Sets the club's direction and goals for the mandate, builds outside partnerships to grow NFC's reach, and works with each department's coordinator to run day-to-day operations.",
    photo: "/departments/board/IMG_5982.JPG",
    people: board,
    subgroups: [
      {
        title: "Department Coordinators",
        people: departmentCoordinators,
      },
    ],
  },
  {
    slug: "general-council",
    name: "General Council",
    badgeImage: "/brand/dept-conselho-geral.png",
    summary:
      "The General Assembly Board and the Fiscal Council together.",
    description:
      "The General Assembly Board chairs the club's general assemblies, and the Fiscal Council oversees its finances and accounts.",
    subgroups: [
      {
        title: "General Assembly Board",
        people: generalAssemblyBoard,
      },
      {
        title: "Fiscal Council",
        people: fiscalCouncil,
      },
    ],
  },
];

// The recurring, named outputs NFC produces — used as the type legend on the
// Articles archive page. Each one is already described in more depth on its
// producing department's card on /departments; this is the publication-facing view.
export type PublicationSeries = {
  name: string;
  englishGloss?: string;
  cadence: string;
  producedBy: string; // department slug
  channel: string;
};

export const publicationSeries: PublicationSeries[] = [
  {
    name: "Economia numa Imagem",
    englishGloss: "The Economy in One Image",
    cadence: "Fortnightly",
    producedBy: "personal-finance",
    channel: "LinkedIn",
  },
  {
    name: "O Segredo dos Números",
    englishGloss: "The Secret of the Numbers",
    cadence: "Fortnightly",
    producedBy: "personal-finance",
    channel: "LinkedIn",
  },
  {
    name: "European Monetary Policy",
    cadence: "About 8 times a year",
    producedBy: "personal-finance",
    channel: "LinkedIn",
  },
  {
    name: "NFC Performance Report",
    cadence: "Quarterly",
    producedBy: "investment",
    channel: "LinkedIn",
  },
  {
    name: "Global Markets & Markets Overview",
    cadence: "Weekly",
    producedBy: "investment",
    channel: "LinkedIn",
  },
];

// Published pieces, newest first. Microsoft Sway presentations from a
// club rubrica that a group of members ran (since discontinued) — not
// official output of any one current department, so they're branded on
// the site as plain articles rather than tagged to a department. Dates
// are the real launch dates the user gave (day/month, year inferred as
// 2026 — the most recent occurrence, unconfirmed). `title` is an English
// translation of the real published Portuguese title (in translations-pt.ts
// under `article.<slug>.title`), same convention as every other piece of
// copy on the site — the destination Sway presentation itself stays in
// Portuguese regardless of which title language the visitor is reading.
export type Article = {
  slug: string;
  title: string;
  department: string | null; // department slug, or null if not department-specific
  date: string; // ISO yyyy-mm-dd
  url: string;
  image: string; // the rubrica's own official cover image, from NFC - Assets/RUBRICA NFC
  // One- or two-sentence abstract, shown on the article's own page and in
  // its share preview. English here; Portuguese under article.<slug>.summary
  // in translations-pt.ts. Leave undefined rather than guessing.
  summary?: string;
  // Named authors, shown as a byline. Leave undefined until confirmed.
  authors?: string[];
};

// Sway's embeddable player for a published Sway link:
// https://sway.cloud.microsoft/<id> -> https://sway.cloud.microsoft/s/<id>/embed
export function swayEmbedUrl(url: string) {
  const id = new URL(url).pathname.split("/").filter(Boolean).pop();
  return id ? `https://sway.cloud.microsoft/s/${id}/embed` : null;
}

export const articles: Article[] = [
  {
    slug: "impacto-bitcoin",
    title: "The Impact of Bitcoin",
    department: null,
    date: "2026-03-12",
    url: "https://sway.cloud.microsoft/B2uWChxoJDiM3BHR",
    image: "/articles/rubrica-impacto-bitcoin.png",
  },
  {
    slug: "acordo-ue-india",
    title: "The EU-India Trade Agreement: What's at Stake",
    department: null,
    date: "2026-03-02",
    url: "https://sway.cloud.microsoft/OeWa7pd42dOPsyam",
    image: "/articles/rubrica-acordo-ue-india.png",
    // From the Sway's own opening paragraph.
    summary:
      "With geopolitics increasingly unstable and a trade war sparked by US tariffs, the European Union and India have finalised a trade agreement. What is at stake?",
  },
  {
    slug: "bolha-ia",
    title: "The AI Bubble: Structural Fragility and Circular Leverage",
    department: null,
    date: "2026-02-23",
    url: "https://sway.cloud.microsoft/POtBWLSQCrgdNkzf",
    image: "/articles/rubrica-bolha-de-ia.png",
  },
  {
    slug: "bitcoin-o-que-e",
    title: "Bitcoin: What Is It?",
    department: null,
    date: "2026-02-09",
    url: "https://sway.cloud.microsoft/99Z35iCMdYufOB1r",
    image: "/articles/rubrica-bitcoin-o-que-e.png",
    // The Sway's own subtitle.
    summary: "Why did we need Bitcoin?",
  },
];

// Past elected leadership, one entry per semester, before the current
// 2026/2027 mandate. Each mandate (one "tomada de posse", one inauguration
// date) spans two semesters; the roster only changes between a mandate's
// two semesters when a substitution is explicitly recorded below. Grouped
// the same way governanceUnits is (Board, General Council as one body
// split into its two subgroups, then Coordinators) so this page reads as
// the historical version of /departments. Nothing here is invented — add
// a term only once its tomada de posse details (and source file, dropped
// into Data/) are in hand.
export type AlumniGroup = {
  title: string;
  people?: Person[];
  subgroups?: { title: string; people: Person[] }[];
};

export type AlumniTerm = {
  slug: string;
  season: "Autumn" | "Spring";
  year: number;
  inauguratedDisplay?: string;
  location?: string;
  groups: AlumniGroup[];
};

// Newest first.
export const alumniTerms: AlumniTerm[] = [
  {
    // Spring half of the mandate from Data/NFC_Alumni_2025-06-17.csv, with
    // a mid-mandate substitution supplied directly by a club officer (not
    // in the CSV): Hugo Pereira -> Sara Abrantes and João Gabriel Fonseca
    // -> Rodrigo Devesa, both as Coordinators. Everyone else unchanged
    // from the Autumn 2025 roster below. No inauguratedDisplay/location:
    // only the Autumn half of a mandate is actually elected/sworn in —
    // Spring continues the same board, so it gets no "sworn in" date of
    // its own.
    slug: "spring-2026",
    season: "Spring",
    year: 2026,
    groups: [
      {
        title: "Board",
        people: [
          { role: "President", name: "Samuel Pires Gonçalves" },
          { role: "Vice President", name: "Duarte Esteves" },
          { role: "Secretary-General", name: "Tiago Santos" },
        ],
      },
      {
        title: "General Council",
        subgroups: [
          {
            title: "General Assembly Board",
            people: [
              { role: "President", name: "João Pinto" },
              { role: "Vice President", name: "António Ferreira" },
              { role: "Secretary", name: "Carlota Rito" },
            ],
          },
          {
            title: "Fiscal Council",
            people: [
              { role: "President", name: "Tiago Neves" },
              { role: "Vice President", name: "Rodrigo Freitas" },
            ],
          },
        ],
      },
      {
        title: "Coordinators",
        people: [
          { role: "Events & Marketing", name: "Sara Abrantes" },
          { role: "Investments", name: "Rodrigo Devesa" },
          { role: "Innovative Trading", name: "Joana Ferreira" },
          { role: "Personal Finance", name: "António Pires" },
        ],
      },
    ],
  },
  {
    // Autumn half of the same mandate — the original roster from
    // Data/NFC_Alumni_2025-06-17.csv, before the Spring 2026 substitution
    // above. Student numbers from that source are deliberately not
    // carried over here; they stay in the CSV, not on the public site.
    slug: "autumn-2025",
    season: "Autumn",
    year: 2025,
    inauguratedDisplay: "June 17, 2025",
    location: `Building 7, Auditorium 1A, ${siteConfig.institutionFullName}`,
    groups: [
      {
        title: "Board",
        people: [
          { role: "President", name: "Samuel Pires Gonçalves" },
          { role: "Vice President", name: "Duarte Esteves" },
          { role: "Secretary-General", name: "Tiago Santos" },
        ],
      },
      {
        title: "General Council",
        subgroups: [
          {
            title: "General Assembly Board",
            people: [
              { role: "President", name: "João Pinto" },
              { role: "Vice President", name: "António Ferreira" },
              { role: "Secretary", name: "Carlota Rito" },
            ],
          },
          {
            title: "Fiscal Council",
            people: [
              { role: "President", name: "Tiago Neves" },
              { role: "Vice President", name: "Rodrigo Freitas" },
            ],
          },
        ],
      },
      {
        title: "Coordinators",
        people: [
          { role: "Events & Marketing", name: "Hugo Pereira" },
          { role: "Investments", name: "João Gabriel Fonseca" },
          { role: "Innovative Trading", name: "Joana Ferreira" },
          { role: "Personal Finance", name: "António Pires" },
        ],
      },
    ],
  },
  {
    // Spring half of the mandate from Data/NFC_Alumni_2025-11-04.csv — no
    // recorded substitution, same roster as Autumn 2024 below. No
    // inauguratedDisplay/location: only Autumn is actually elected/sworn
    // in, per the same reasoning as Spring 2026 above.
    slug: "spring-2025",
    season: "Spring",
    year: 2025,
    groups: [
      {
        title: "Board",
        people: [
          { role: "President", name: "Tiago Neves" },
          { role: "Vice President", name: "Constança Branco" },
          { role: "Secretary-General", name: "Beatriz Raimundo" },
        ],
      },
      {
        title: "General Council",
        subgroups: [
          {
            title: "General Assembly Board",
            people: [
              { role: "President", name: "Rita Milhazes" },
              { role: "Vice President", name: "Joana Silvestre" },
              { role: "Secretary", name: "Miguel Teles Pepino" },
            ],
          },
          {
            title: "Fiscal Council",
            people: [
              { role: "President", name: "Guilherme Antunes" },
              { role: "Vice President", name: "Mafalda Martins" },
            ],
          },
        ],
      },
      {
        title: "Coordinators",
        people: [
          { role: "Quantitative Trading", name: "Diogo Seves" },
          { role: "Finance", name: "Samuel Pires Gonçalves" },
          { role: "Image", name: "Tiago Santos" },
          { role: "Investments", name: "Rodrigo Freitas" },
        ],
      },
    ],
  },
  {
    // Autumn half of the same mandate — from Data/NFC_Alumni_2025-11-04.csv.
    // Student numbers from that source are deliberately not carried over
    // here; they stay in the CSV, not on the public site.
    slug: "autumn-2024",
    season: "Autumn",
    year: 2024,
    // The source CSV (Data/NFC_Alumni_2025-11-04.csv) records "2025-11-04"
    // for every person's Data de Tomada de Posse — confirmed by the user
    // to be a one-year typo; the real date is November 4, 2024.
    inauguratedDisplay: "November 4, 2024",
    location: `Building 7, Auditorium 1A, ${siteConfig.institutionFullName}`,
    groups: [
      {
        title: "Board",
        people: [
          { role: "President", name: "Tiago Neves" },
          { role: "Vice President", name: "Constança Branco" },
          { role: "Secretary-General", name: "Beatriz Raimundo" },
        ],
      },
      {
        title: "General Council",
        subgroups: [
          {
            title: "General Assembly Board",
            people: [
              { role: "President", name: "Rita Milhazes" },
              { role: "Vice President", name: "Joana Silvestre" },
              { role: "Secretary", name: "Miguel Teles Pepino" },
            ],
          },
          {
            title: "Fiscal Council",
            people: [
              { role: "President", name: "Guilherme Antunes" },
              { role: "Vice President", name: "Mafalda Martins" },
            ],
          },
        ],
      },
      {
        title: "Coordinators",
        people: [
          { role: "Quantitative Trading", name: "Diogo Seves" },
          { role: "Finance", name: "Samuel Pires Gonçalves" },
          { role: "Image", name: "Tiago Santos" },
          { role: "Investments", name: "Rodrigo Freitas" },
        ],
      },
    ],
  },
];

// The NFC Fund — the Investments Department's Division 01 (Asset Management).
export const nfcFund = {
  name: "NFC Fund",
  coordinator: "Rodrigo Devesa",
  mandate:
    "A virtual fund with an initial allocation set at the start of the mandate, split into coverage teams, each managing its own portion of the fund.",
  benchmark: "S&P 500",
  report: {
    name: "NFC Performance Report",
    cadence: "Quarterly",
    channel: "LinkedIn",
  },
};

// Recruitment status, shown at the top of /join and on the header button.
// Roll this over at the start of every cycle — an expired date on the Join
// page is the most visible kind of staleness a club site can have. Dates
// stay null until the Board sets them; the page then says "to be announced".
export const recruitment = {
  open: false,
  season: "Spring",
  year: 2027,
  applicationsOpen: null as string | null, // ISO date, e.g. "2027-02-15"
  applicationsClose: null as string | null,
  weeklyHours: "2–4",
};
