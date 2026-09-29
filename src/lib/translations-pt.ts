// Portuguese translations, keyed by a stable dotted key. Looked up via
// useT()'s t(key, english) — see src/lib/language.tsx. English always lives
// at the call site (JSX or site-data.ts), never duplicated here.
//
// Kept in English on purpose, sitewide (not translated below): the club's
// own name/brand ("Nova Finance Club", "NFC", "NFC Fund", "NFC Performance
// Report"), governance body names (Board, General Council, General Assembly
// Board, Fiscal Council), department names (e.g. "Investments Department"),
// role titles (President, Vice President, Secretary, Coordinator, Member),
// people's names, and standard finance jargon (Sharpe ratio, benchmark,
// drawdown, Global Macro, S&P 500).
export const pt: Record<string, string> = {
  // Header / nav
  "nav.aboutus": "Sobre Nós",
  "nav.departments": "Departamentos",
  "nav.alumni": "Alumni",
  "nav.articles": "Artigos",
  "nav.fund": "Fundo",
  "nav.join": "Inscrever",
  "nav.joinButton": "Inscreve-te: {season} {year}",
  "nav.openMenu": "Abrir menu",
  "nav.departmentCoordinators": "Coordenadores de Departamento",

  // Footer
  "footer.mandate": "Mandato",

  // Language toggle
  "language.toggleLabel": "Mudar de idioma",

  // Shared
  "institution.short": "NOVA FCT",
  "institution.full": "Faculdade de Ciências e Tecnologia da Universidade Nova de Lisboa",
  "site.missionStatement":
    "Fundado em {foundedYear}, o {name} é uma organização liderada por estudantes na {institutionFullName}. A nossa missão é fomentar a literacia financeira, despertar o interesse pelos mercados financeiros e dar aos estudantes competências práticas.",

  // Homepage
  "home.slogan": "A ponte entre a Ciência e as Finanças",
  "home.heroSubtitle": "Somos um clube de finanças liderado por estudantes da {institutionFullName}.",
  "home.contactButton": "Contacto",
  "home.numbersHeading": "{shortName} em números",
  "home.stat.members": "membros",
  "home.stat.departments": "departamentos",
  "home.stat.distinctBackgrounds": "formações distintas",
  "home.stat.yearsActive": "anos de atividade",
  "home.whatWeDoHeading": "O que fazemos",
  "home.articlesHeading": "Últimos Artigos",
  "home.articlesSubtitle":
    "Séries editoriais regulares e relatórios de mercado, publicados pelos vários departamentos.",
  "home.articlesEmpty": "Ainda não há artigos publicados.",
  "home.browseArchive": "Ver o arquivo",
  "home.fundHeading": "{shortName} Fund",
  "home.fundSubtitle":
    "O fundo virtual do Departamento de Investimentos. Mandato, metodologia e relatórios trimestrais.",
  "home.seeFund": "Ver o fundo",
  "home.followUsHeading": "Segue-nos",
  "home.followUsSubtitle":
    "Novidades dos departamentos, resumos de eventos e comentário de mercado, publicados onde os nossos membros já estão.",
  "home.getInTouchHeading": "Contacta-nos",

  // About
  "about.hero.headline":
    "Existe uma lacuna real na formação dos estudantes de ciências e engenharia.",
  "about.hero.subtext": "O Nova Finance Club nasceu dessa constatação.",
  "about.gapBody":
    "Muitos cientistas e engenheiros, à medida que a carreira avança, assumem funções em gestão, finanças ou liderança, onde este conhecimento se torna essencial.",
  "about.gapStatNumber": "2º",
  "about.gapStatCaption":
    "A engenharia é o segundo curso mais comum entre quem ocupa cargos de liderança em Portugal, logo a seguir a Gestão.",
  "about.missionHeading": "Missão",
  "about.aboutMission":
    "A nossa missão é simples: fomentar a literacia financeira, despertar interesse genuíno pelos mercados, e construir as competências práticas de que os estudantes precisam.",
  "about.membersHeading": "Membros",
  "about.aboutMembersLead":
    "Os nossos {memberCount} membros vêm de {distinctBackgrounds} formações académicas diferentes, incluindo:",
  "about.backgroundHeading": "Contexto",
  "about.aboutBackground":
    "O Nova Finance Club nasceu em 2024 na NOVA School of Science and Technology. Desde então cresceu para quatro departamentos (Investimentos, Quantitative Trading, Finanças Pessoais, e Eventos e Relações Externas), geridos por uma Direção e um Conselho Geral eleitos.",
  "about.communityLead":
    "O NFC não é só um clube académico. É uma comunidade construída à volta da entreajuda entre membros. Acreditamos que, ao juntarmos pessoas com diferentes backgrounds e interesses, todos saem a ganhar.",
  "about.communityExperienced":
    "Quem tem mais experiência ajuda quem está a começar.",
  "about.communityNewcomers":
    "Quem chega de novo traz energia e um olhar diferente.",
  "about.seeDepartments": "Ver os nossos departamentos",
  "about.joinButton": "Inscreve-te na {shortName}",

  // Departments index
  "departments.index.heading": "Departamentos",
  "departments.index.subtitle": "A governança da {shortName} e os seus quatro departamentos funcionais.",
  "departments.index.deptListHeading": "Departamentos",

  // Departments detail page (chrome, not data)
  "departmentsSlug.back": "Departamentos",
  "departmentsSlug.eyebrowGovernance": "Governança · {count} membros",
  "departmentsSlug.eyebrowDepartment": "Departamento · {count} membros",
  "departmentsSlug.ourTeam": "A Nossa Equipa",
  "departmentsSlug.ourTeamButton": "A nossa equipa",

  // Person card contact action — mailto to the club's shared address with
  // the person's name in the subject line (no individual member emails
  // are published on the site).
  "personCard.emailSubject": "Contacto para {name}",
  "personCard.emailAriaLabel": "Enviar email para {name}",
  "personCard.linkedinAriaLabel": "{name} no LinkedIn",
  "personCard.degreeLine": "{level} em {name}",
  "degree.level.bsc": "Licenciatura",
  "degree.level.msc": "Mestrado",

  // Degree/course names, matching each person's course code in
  // memberDegrees (site-data.ts) to FCT NOVA's official Portuguese course
  // title.
  "degree.name.applied-mathematics-for-risk-management": "Matemática Aplicada à Gestão de Risco",
  "degree.name.computer-engineering": "Engenharia Informática",
  "degree.name.geological-engineering": "Engenharia Geológica",
  "degree.name.industrial-engineering-and-management": "Engenharia e Gestão Industrial",
  "degree.name.electrical-and-computer-engineering": "Engenharia Eletrotécnica e de Computadores",
  "degree.name.mathematics-and-applications": "Matemática e Aplicações",
  "degree.name.mathematics": "Matemática",
  "degree.name.biochemistry": "Bioquímica",
  "degree.name.biomedical-engineering": "Engenharia Biomédica",
  "degree.name.actuarial-mathematics": "Matemática Atuarial",
  "degree.name.big-data-analytics-and-engineering": "Análise e Engenharia de Big Data",

  // Governance unit names and summaries
  "gov.board.name": "Direção",
  "gov.board.summary": "A liderança executiva eleita da {shortName} para o mandato 2026/2027.",
  "gov.board.description":
    "Define a direção e os objetivos do clube para o mandato, constrói parcerias externas para expandir o alcance da NFC, e trabalha com o coordenador de cada departamento na gestão do dia a dia.",
  "gov.general-council.name": "Conselho Geral",
  "gov.general-council.summary": "A Mesa da Assembleia Geral e o Conselho Fiscal juntos.",
  "gov.general-council.description":
    "A Mesa da Assembleia Geral preside às assembleias gerais do clube, e o Conselho Fiscal fiscaliza as suas finanças e contas.",

  // Governance subgroup titles (General Council's two constituent bodies)
  "subgroup.general-assembly-board": "Mesa da Assembleia Geral",
  "subgroup.fiscal-council": "Conselho Fiscal",

  // Role / position titles. Gender-neutral in Portuguese (Presidente,
  // Vice-Presidente) need no per-person variant; Secretary/Secretary-General
  // are masculine here because every person currently holding them is male
  // (verify before reusing this key for someone else). The department
  // Coordinator roles ARE gendered per the actual coordinator's name.
  "role.president": "Presidente",
  "role.vice-president": "Vice-Presidente",
  "role.secretary": "Secretário",
  "role.secretary-general": "Secretário-Geral",
  "role.member": "Membro",
  // Composite "X Coordinator" labels on the Board page's coordinators list.
  "role.events-external-relations-coordinator": "Coordenadora de Eventos e Relações Externas",
  "role.personal-finance-coordinator": "Coordenadora de Finanças Pessoais",
  "role.investment-coordinator": "Coordenador de Investimentos",
  "role.quantitative-trading-coordinator": "Coordenador de Quantitative Trading",
  // Plain "Coordinator" label on each department's own team page. Keyed by
  // the coordinator's own name (translation happens inside PersonCard,
  // which only has the person, not which department page it's on) so it's
  // gendered correctly regardless of context: Coordenador/Coordenadora.
  "role.coordinator.by-name.gisela-alves": "Coordenadora",
  "role.coordinator.by-name.isabel-monteiro": "Coordenadora",
  "role.coordinator.by-name.rodrigo-devesa": "Coordenador",
  "role.coordinator.by-name.diogo-ruivo": "Coordenador",

  // Department names — translated. "Quantitative Trading" itself stays
  // English inside the name (only "Department" becomes "Departamento de");
  // no key needed for the short form since it's just "Quantitative Trading"
  // in both languages, unchanged. "short" drops the "Department" /
  // "Departamento de" wrapper, for badges/filter chips.
  "dept.events-external-relations.name": "Departamento de Eventos e Relações Externas",
  "dept.events-external-relations.short": "Eventos e Relações Externas",
  "dept.personal-finance.name": "Departamento de Finanças Pessoais",
  "dept.personal-finance.short": "Finanças Pessoais",
  "dept.investment.name": "Departamento de Investimentos",
  "dept.investment.short": "Investimentos",
  "dept.quantitative-trading.name": "Departamento de Quantitative Trading",
  "dept.quantitative-trading.short": "Quantitative Trading",

  // Department summaries / descriptions
  "dept.events-external-relations.summary":
    "Organiza os eventos do clube, a sua campanha de recrutamento e as suas relações externas.",
  "dept.events-external-relations.description":
    "Planeia e organiza os eventos da NFC, desde socials internos e cerimónias de integração a painéis externos e masterclasses com convidados do setor financeiro. Lidera também a campanha de recrutamento semestral, gere as relações com parceiros e patrocinadores, e coordena com outros núcleos de finanças a nível nacional.",
  "dept.events-external-relations.mandateGoal":
    "1000 seguidores no LinkedIn até ao final do mandato 2026/2027.",

  "dept.personal-finance.summary":
    "Torna a economia e as finanças pessoais acessíveis à comunidade da NOVA FCT, através de séries editoriais regulares.",
  "dept.personal-finance.description":
    "Torna a economia e as finanças pessoais acessíveis à comunidade da NOVA FCT e no LinkedIn, através de três séries editoriais regulares. Produz conteúdo educativo para um público não especializado, e acompanha as decisões de política do Banco Central Europeu à medida que acontecem.",
  "dept.personal-finance.series.0.description":
    "Um gráfico ou estatística que conta uma história económica, com o mínimo de texto.",
  "dept.personal-finance.series.1.description":
    "Uma análise curta e acessível a uma única estatística económica.",
  "dept.personal-finance.series.2.description":
    "Publicado uma semana após cada reunião do Banco Central Europeu (BCE): a decisão sobre as taxas, a sua justificação, e os dados de inflação e crescimento da zona euro.",

  "dept.investment.summary": "Gere o fundo de investimento virtual do clube e acompanha os mercados de capitais globais.",
  "dept.investment.description":
    "Gere o fundo de investimento virtual da NFC e mantém o clube ligado aos mercados de capitais globais, dando aos membros experiência prática com decisões de portefólio reais e análise de mercado.",
  "dept.investment.divisions.0.name": "Divisão 01 — Asset Management",
  "dept.investment.divisions.0.description":
    "Gere um fundo virtual com uma alocação inicial definida no início do mandato, dividido em equipas de cobertura (ex: Iberia & Europe, Emerging Markets, Global Macro), cada uma gerindo a sua própria parte do fundo e produz o NFC Performance Report trimestral no LinkedIn.",
  "dept.investment.divisions.1.name": "Divisão 02 — Global Markets & Markets Overview",
  "dept.investment.divisions.1.description":
    "Publica um relatório semanal curto sobre o desempenho dos mercados de capitais (yields, commodities, FX) com um resumo dos principais eventos da semana.",

  "dept.quantitative-trading.summary":
    "Constrói projetos de finanças quantitativas com dados reais de mercado, em três divisões.",
  "dept.quantitative-trading.description":
    "Constrói projetos de finanças quantitativas com dados reais de mercado, de estratégias sistemáticas a otimização de portefólios e dados alternativos. Os membros começam pelo Quant Crash Course, uma introdução curta a cada uma das três divisões do departamento, e depois trabalham em projetos dentro da sua divisão, entregues em Jupyter notebooks e apresentados ao departamento.",

  // NFC Fund
  "fund.subtitle": "Um portefólio simulado para a prática real de investimento.",
  "fund.mandateHeading": "Mandato",
  "fund.mandateBody":
    "Um fundo virtual com uma alocação inicial definida no início do mandato, dividido em equipas de cobertura, cada uma gerindo a sua própria parte do fundo.",
  "fund.benchmarkNote": "Benchmark: {benchmark}.",
  "fund.performanceHeading": "Desempenho",
  "fund.cumulativePerformanceEmpty":
    "O desempenho acumulado aparecerá aqui assim que o fundo reportar o seu primeiro trimestre.",
  "fund.headlineFigures": "Indicadores principais",
  "fund.stat.cumulativeReturn": "Retorno acumulado",
  "fund.stat.sharpeRatio": "Sharpe ratio",
  "fund.stat.maxDrawdown": "Max drawdown",
  "fund.stat.vsBenchmark": "vs. benchmark",
  "fund.reportingHeading": "Relatórios",
  "fund.reportingSummary": "{reportName} — publicado {cadence} no {channel}.",
  "fund.reportsEmpty": "Nenhum publicado ainda — o primeiro chega após o primeiro trimestre do fundo.",
  "fund.disclaimer":
    "O {fundName} é um portefólio simulado e educativo, gerido por membros da {shortName}. Nada nesta página constitui aconselhamento de investimento.",
  "fund.cadence.quarterly": "trimestralmente",

  // Join
  "join.heading": "Inscreve-te",
  "join.applicationsClosed": "Candidaturas encerradas",
  "join.nextRecruitment": "Próximo recrutamento: Semestre de Primavera",
  "join.intro1":
    "Ao entrares na {shortName} vais conhecer outros estudantes interessados em finanças, acompanhar o que realmente se passa nos mercados e na economia, e pôr em prática parte do que aprendes nas aulas.",
  "join.intro2":
    "Os nossos membros dedicam uma parte real do seu tempo livre, e dir-te-iam que vale a pena. Se finanças é a tua área, não percas o próximo recrutamento.",
  "join.whoShouldApplyHeading": "Quem se deve candidatar?",
  "join.whoShouldApplySubtitle": "Procuramos estudantes para os seguintes departamentos.",
  "join.pitch.investment.0": "queres gerir ativamente um fundo real e ver os teus calls em ação",
  "join.pitch.investment.1": "queres melhorar a tua leitura dos mercados e a escolha de ações",
  "join.pitch.investment.2": "queres perceber como as decisões de investimento são tomadas na prática",
  "join.pitch.personal-finance.0": "gostas de explicar as coisas com clareza e escrever para um público real",
  "join.pitch.personal-finance.1": "és curioso sobre a economia e queres acompanhá-la mais de perto",
  "join.pitch.personal-finance.2": "queres que o teu trabalho seja visto por pessoas fora do clube",
  "join.pitch.quantitative-trading.0": "queres aprender quant finance do zero, sem precisares de experiência prévia",
  "join.pitch.quantitative-trading.1": "gostas de programar e queres aplicá-lo a problemas reais de finanças",
  "join.pitch.quantitative-trading.2": "queres acabar com um projeto que possas mesmo mostrar",
  "join.pitch.events-external-relations.0": "gostas de organizar coisas e falar com pessoas",
  "join.pitch.events-external-relations.1": "queres ajudar a trazer parceiros, oradores e eventos para o clube",
  "join.pitch.events-external-relations.2": "queres uma experiência que vá além do académico",
  "join.eligibility":
    "Para seres elegível precisas de ser estudante na {institution}, em qualquer curso, em qualquer ano. Procuramos interesse genuíno em finanças e algum tempo livre real para dar ao clube.",
  "join.processHeading": "Como funciona o processo",
  "join.process.0": "Submete o teu formulário de candidatura",
  "join.process.1": "Entrevista curta com o(s) departamento(s) da tua escolha",
  "join.process.2": "Resultados e sessão de integração",
  "join.questions": "Dúvidas? Contacta-nos em",

  // Articles
  "articles.heading": "Artigos",
  "articles.subtitle": "Séries editoriais regulares e relatórios de mercado, publicados pelos departamentos da NFC.",
  "articles.introStart": "Pesquisa os artigos e relatórios publicados pela NFC, dos departamentos de",
  "articles.introAnd": "e",
  "articles.searchPlaceholder": "Pesquisar artigos...",
  "articles.all": "Todos",
  "articles.genericLabel": "Artigo",
  "article.impacto-bitcoin.title": "O impacto da Bitcoin",
  "article.acordo-ue-india.title": "O Acordo comercial UE-Índia: O que está em causa",
  "article.bolha-ia.title": "A Bolha de IA: Fragilidade Estrutural e Alavancagem Circular",
  "article.bitcoin-o-que-e.title": "Bitcoin, o que é?",
  "articles.noMatch": "Nenhum artigo corresponde à tua pesquisa.",
  "articles.noneYet": "Ainda não há edições publicadas. As primeiras entradas aparecerão aqui assim que forem publicadas.",

  // Alumni
  "alumni.heading": "Alumni",
  "alumni.subtitle": "A liderança eleita da {shortName} em mandatos anteriores.",
  "alumni.swornIn": "Tomaram posse a",
  "alumni.swornInAt": "em",
  "alumni.season.autumn": "Outono",
  "alumni.season.spring": "Primavera",
  "alumni.term.autumn-2025.inaugurated": "17 de junho de 2025",
  "alumni.term.autumn-2024.inaugurated": "4 de novembro de 2024",
  "alumni.location": "Edifício 7, Auditório 1A, {institutionFullName}",
  "alumni.group.board": "Direção",
  "alumni.group.general-council": "Conselho Geral",
  "alumni.group.coordinators": "Coordenadores",

  // Contact form
  "contact.yourName": "O teu nome",
  "contact.namePlaceholder": "Maria Silva",
  "contact.yourEmail": "O teu email",
  "contact.message": "Mensagem",
  "contact.messagePlaceholder": "Como podemos ajudar?",
  "contact.send": "Enviar Mensagem",
  "contact.opensEmailApp": "Abre a tua aplicação de email, endereçada a {email}.",

  // --- Added with the /pt routes, Partners page and Join/Fund rework ---
  "meta.site.description": "O Nova Finance Club (NFC) é o clube de finanças dos estudantes da NOVA School of Science and Technology (NOVA FCT): um fundo de investimento virtual, projetos de finanças quantitativas, análise de mercado e eventos.",
  "meta.about.title": "Sobre Nós",
  "meta.about.description": "Como nasceu o Nova Finance Club, para que serve e quem são os seus membros: {memberCount} estudantes de {distinctBackgrounds} cursos da NOVA FCT.",
  "meta.alumni.title": "Alumni",
  "meta.alumni.description": "A liderança eleita do Nova Finance Club em mandatos anteriores.",
  "meta.articles.title": "Artigos",
  "meta.articles.description": "Artigos e análise de mercado publicados por membros do Nova Finance Club.",
  "meta.departments.title": "Departamentos",
  "meta.departments.description": "Os órgãos sociais do Nova Finance Club e os seus quatro departamentos: Investimentos, Quantitative Trading, Finanças Pessoais, e Eventos e Relações Externas.",
  "meta.fund.description": "O NFC Fund: o portefólio simulado do Departamento de Investimentos, com o S&P 500 como benchmark e relatórios trimestrais.",
  "meta.join.title": "Inscreve-te",
  "meta.join.description": "Como entrar no Nova Finance Club: quem se pode candidatar, o que procura cada departamento, o processo de recrutamento e perguntas frequentes. Próximo recrutamento: Primavera 2027.",
  "meta.partners.title": "Parcerias",
  "meta.partners.description": "Trabalha com o Nova Finance Club: chega aos estudantes de matemática, engenharia e dados da NOVA FCT através de eventos, desafios, recrutamento e visibilidade.",
  "nav.partners": "Parcerias",
  "nav.joinButtonOpen": "Candidata-te: {season} {year}",
  "nav.mainLabel": "Principal",
  "language.label": "Idioma",
  "footer.navLabel": "Site",
  "season.spring": "Primavera",
  "season.autumn": "Outono",
  "notFound.heading": "Esta página não existe.",
  "notFound.body": "Pode ter mudado de sítio, ou o link pode estar errado.",
  "notFound.home": "Voltar à página inicial",
  "home.joinButton": "Junta-te a nós: {season} {year}",
  "home.joinOpenButton": "Candidata-te: {season} {year}",
  "home.whatWeDoButton": "O que fazemos",
  "article.back": "Artigos",
  "article.by": "Por",
  "article.openInSway": "Abrir no Sway",
  "article.swayNote": "Publicado no Microsoft Sway, em português.",
  "article.moreHeading": "Mais artigos",
  "article.loading": "A carregar o Sway…",
  "article.acordo-ue-india.summary": "Num contexto geopolítico cada vez mais instável e numa guerra comercial provocada pelas tarifas americanas, a União Europeia e a Índia finalizaram um acordo comercial. O que está em causa?",
  "article.bitcoin-o-que-e.summary": "Porque precisávamos da Bitcoin?",
  "departmentsSlug.codeOnGithub": "Código no GitHub",
  "dept.quantitative-trading.divisions.0.name": "Divisão 01 — Signal Research",
  "dept.quantitative-trading.divisions.0.description": "Estratégias de trading sistemáticas e machine learning: encontrar sinais nos dados de mercado e testar se resistem fora da amostra.",
  "dept.quantitative-trading.divisions.1.name": "Divisão 02 — Portfolio & Risk",
  "dept.quantitative-trading.divisions.1.description": "Construção de portefólios e gestão de risco com métodos de otimização, sempre comparados com um benchmark.",
  "dept.quantitative-trading.divisions.2.name": "Divisão 03 — Sentiment & Alternative Data",
  "dept.quantitative-trading.divisions.2.description": "Processamento de linguagem natural e fontes de dados alternativas, para transformar texto e outros dados não tradicionais em sinais mensuráveis.",
  "about.gapHeading": "A lacuna",
  "about.membersCaption": "cursos representados entre os nossos {memberCount} membros.",
  "about.departmentsCaption": "departamentos, geridos por uma Direção e um Conselho Geral eleitos.",
  "join.applicationsOpen": "Candidaturas abertas",
  "join.nextRecruitmentWhen": "Próximo recrutamento: {seasonLabel}, {window}",
  "join.window": "de {from} a {to}",
  "join.datesTba": "datas a anunciar",
  "join.notify.subject": "Avisem-me: recrutamento de {seasonLabel}",
  "join.notify.body": "Olá NFC,\n\nGostava de ser avisado/a quando abrirem as candidaturas de {seasonLabel}.\n\nNome: {name}\nCurso e ano: {course}\n",
  "join.notify.course": "Curso e ano (opcional)",
  "join.notify.button": "Avisem-me quando abrirem as candidaturas",
  "join.glance.who": "Quem se pode candidatar",
  "join.glance.whoValue": "Qualquer estudante da {institution}, de qualquer curso e ano",
  "join.glance.time": "Tempo dedicado",
  "join.glance.timeValue": "{hours} horas por semana",
  "join.glance.next": "Próximo recrutamento",
  "join.notify.coursePlaceholder": "Curso e ano (opcional)",
  "join.pitchLead": "É para ti se:",
  "join.processWhen.1": "Depois de fecharem as candidaturas",
  "join.processWhen.2": "No fim do processo",
  "join.faqHeading": "Perguntas frequentes",
  "join.faq.0.q": "Preciso de ter formação em finanças?",
  "join.faq.0.a": "Não. Procuramos interesse genuíno em finanças, não experiência prévia. O Quantitative Trading, por exemplo, começa do zero com o seu Quant Crash Course.",
  "join.faq.1.q": "Que cursos e anos se podem candidatar?",
  "join.faq.1.a": "Qualquer estudante da {institution}, de qualquer curso e de qualquer ano: os nossos membros vêm de matemática, engenharia, informática, bioquímica e ciência de dados.",
  "join.faq.2.q": "Posso candidatar-me a mais do que um departamento?",
  "join.faq.2.a": "Sim. A entrevista é com o(s) departamento(s) que escolheres, por isso diz-nos quais te interessam.",
  "join.faq.3.q": "Quanto tempo exige?",
  "join.faq.3.a": "Cerca de {hours} horas por semana, com picos nas semanas de eventos ou entregas.",
  "join.faq.4.q": "Quando é o próximo recrutamento?",
  "join.faq.4.a": "No semestre de {season} {year}. As datas vão ser anunciadas aqui e no nosso Instagram e LinkedIn; deixa os teus dados acima e avisamos-te quando abrirem as candidaturas.",
  "partners.heading": "Parcerias",
  "partners.subtitle": "Trabalha com o clube de finanças da NOVA School of Science and Technology.",
  "partners.intro": "O {shortName} junta {memberCount} estudantes de {degreeCount} cursos da {institution}, a maioria de matemática, engenharia e dados. Se a tua organização quer chegar até eles, estas são as formas como trabalhamos com parceiros.",
  "partners.stat.degrees": "cursos",
  "partners.stat.founded": "fundação",
  "partners.formatsHeading": "Como podemos trabalhar juntos",
  "partners.format.talent.title": "Acesso a talento",
  "partners.format.talent.body": "Divulgar estágios, programas de graduados e ofertas de emprego junto dos nossos membros, e conhecê-los pessoalmente.",
  "partners.format.events.title": "Eventos co-organizados",
  "partners.format.events.body": "Workshops, palestras e masterclasses na NOVA FCT, planeados e divulgados em conjunto com a nossa equipa de Eventos e Relações Externas.",
  "partners.format.visibility.title": "Visibilidade",
  "partners.format.visibility.body": "A tua marca nas redes sociais, eventos e site do NFC, ao lado do trabalho que os nossos membros publicam.",
  "partners.format.challenges.title": "Case studies e desafios",
  "partners.format.challenges.body": "Desafios práticos para os nossos membros, de case studies a competições de trading, construídos à volta de um problema que a tua equipa conhece bem.",
  "partners.audienceHeading": "A quem chegas",
  "partners.audienceSubtitle": "Os cursos dos nossos membros atuais, de licenciatura e mestrado.",
  "partners.contactHeading": "Vamos falar",
  "partners.contactLine": "As parcerias estão a cargo de {name}, coordenadora do nosso Departamento de Eventos e Relações Externas.",
  "partners.meetTeam": "Conhecer a equipa",
  "partners.emailSubject": "Proposta de parceria",
  "fund.status": "Arranca com o mandato {mandate}. Os indicadores de desempenho e o primeiro NFC Performance Report vão ser publicados aqui depois do primeiro trimestre do fundo.",
  "fund.howHeading": "Como funciona",
  "fund.how.0": "No início do mandato é definida uma alocação inicial.",
  "fund.how.1": "O fundo é dividido por equipas de cobertura (por exemplo Iberia & Europe, Emerging Markets e Global Macro), cada uma a gerir a sua parte.",
  "fund.how.2": "Todos os trimestres, o {reportName} apresenta o retorno do fundo face ao {benchmark}.",
  "fund.teamHeading": "Equipa",
  "fund.teamBody": "Gerido pelos {count} membros do Departamento de Investimentos, coordenados por {coordinator}.",
  "fund.meetTeam": "Conhecer a equipa",
  "fund.factsHeading": "Dados principais",
  "fund.fact.type": "Tipo",
  "fund.fact.typeValue": "Portefólio simulado e educativo",
  "fund.fact.benchmark": "Benchmark",
  "fund.fact.managedBy": "Gerido por",
  "fund.fact.reporting": "Relatórios",
  "fund.fact.reportingValue": "Trimestrais, no LinkedIn",
  "fund.fact.start": "Início",
  "fund.fact.startValue": "Mandato {mandate}",
};
