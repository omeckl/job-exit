type Page = { title: string; body: string[] };
type Pages = Record<"about" | "terms" | "privacy" | "cookies", Page>;

const hu: Pages = {
  about: {
    title: "Hogyan működik",
    body: [
      "Ez az oldal azokat a pozíciókat gyűjti össze, amelyeket éppen most hagy el valaki. A hirdetést maga a távozó munkatárs írja — nem a HR, nem toborzó.",
      "A távozónak: 1) leírod a pozíciódat, 2) megosztod a linket (például LinkedInen), 3) elolvasod a jelentkezéseket, és akinek szeretnéd, küldesz egy átadó üzenetet arról, hogy kihez forduljon a cégnél.",
      "Az álláskeresőnek: 1) böngészel regisztráció nélkül, 2) jelentkezel egy bemutatkozással és a LinkedIn-profiloddal, 3) ha a távozó úgy látja, hogy illesz a helyére, kapsz tőle egy üzenetet a belső kapcsolattartóval.",
      "Amit az oldal nem csinál: nem keresi meg a munkáltatót, nem ellenőrzi a hirdetéseket, nem közvetít pénzt, és nem ad hivatalos ajánlást. A távozó útbaigazítása nem jelent felvételi ígéretet.",
      "A szolgáltatás jelenleg ingyenes.",
    ],
  },
  terms: {
    title: "Általános Szerződési Feltételek (vázlat)",
    body: [
      "Ez a dokumentum vázlat, jogi felülvizsgálat előtt. Élesítés előtt ügyvédi ellenőrzés szükséges.",
      "1. A szolgáltatás. Az utodom.hu felületet biztosít arra, hogy a munkahelyüket elhagyó felhasználók közzétegyék az általuk elhagyott pozíciót, és hogy az álláskeresők jelentkezzenek ezekre.",
      "2. A szolgáltatás nem munkaerő-közvetítés és nem munkaerő-kölcsönzés. Az üzemeltető nem áll kapcsolatban a hirdetésben szereplő munkáltatóval, nem ellenőrzi a hirdetések valóságtartalmát, és nem garantál semmilyen eredményt.",
      "3. Felhasználói tartalom. A hirdetést közzétevő felhasználó felel azért, hogy jogosult a közzétett információk megosztására, és hogy nem sért titoktartási vagy egyéb kötelezettséget.",
      "4. Tiltott magatartás: valótlan hirdetés, más nevében történő közzététel, jogsértő vagy sértő tartalom, tömeges vagy automatizált használat, harmadik személy adatainak jogosulatlan megadása.",
      "5. Moderáció. Az üzemeltető bármely hirdetést indokolás nélkül elrejthet, és bármely fiókot letilthat, ha a jelen feltételek megsértését észleli.",
      "6. Felelősség. Az üzemeltető felelőssége a jogszabály által megengedett legszűkebb körre korlátozódik; nem felel a felhasználók közötti kapcsolatfelvétel eredményéért.",
      "7. A szolgáltatás ingyenes, és az üzemeltető fenntartja a jogot a feltételek módosítására.",
      "8. Kapcsolat: hello@utodom.hu",
    ],
  },
  privacy: {
    title: "Adatkezelési tájékoztató (vázlat)",
    body: [
      "Ez a dokumentum vázlat, jogi felülvizsgálat előtt.",
      "Kezelt adatok — hirdető: e-mail-cím, név (és ha megadja: fénykép), a hirdetés tartalma. Jogalap: szerződés teljesítése (GDPR 6. cikk (1) b)).",
      "Kezelt adatok — jelentkező: e-mail-cím, LinkedIn-profil link, bemutatkozás, opcionálisan bérigény és felmondási idő. Ezeket az adatokat a hirdető megkapja, és az e-mail-címedet is látja.",
      "Belépés: jelszó nélküli, e-mailre küldött belépő linkkel. Munkamenet-sütit használunk a bejelentkezés fenntartásához.",
      "Adatmegőrzés: az adatokat a fiók törléséig kezeljük. A fiók törlésével minden adat és hirdetés véglegesen törlődik. A lezárt hirdetés tartalma eltávolításra kerül.",
      "Adatfeldolgozók: tárhely- és e-mail-küldő szolgáltató (az aktuális lista kérésre elérhető).",
      "Jogaid: hozzáférés, helyesbítés, törlés, korlátozás, tiltakozás, adathordozhatóság, valamint panasz a NAIH-nál.",
      "Kapcsolat: hello@utodom.hu",
    ],
  },
  cookies: {
    title: "Süti-tájékoztató (vázlat)",
    body: [
      "Csak a működéshez feltétlenül szükséges sütit használunk: a bejelentkezési munkamenet fenntartásához.",
      "Nem használunk hirdetési vagy profilalkotási sütit. A látogatottság mérésére süti nélküli statisztikai megoldást tervezünk használni.",
      "A munkamenet-süti a kijelentkezéskor vagy legkésőbb 60 nap után lejár.",
    ],
  },
};

const en: Pages = {
  about: {
    title: "How it works",
    body: [
      "This site collects positions that someone is leaving right now. The listing is written by the departing employee — not by HR, not by a recruiter.",
      "If you're leaving: 1) describe your position, 2) share the link (for example on LinkedIn), 3) read the applications and send a handover message telling the person you pick who to contact inside the company.",
      "If you're job hunting: 1) browse without signing up, 2) apply with an introduction and your LinkedIn profile, 3) if the departing employee thinks you fit, you receive a message with the internal contact.",
      "What this site does not do: it does not contact the employer, does not verify listings, does not handle money, and gives no official recommendation. A handover message is not a promise of a job.",
      "The service is currently free.",
    ],
  },
  terms: {
    title: "Terms of Service (draft)",
    body: [
      "This document is a draft and must be reviewed by a lawyer before launch.",
      "1. The service. utodom.hu provides a platform where people leaving their job can publish the position they vacate, and where job seekers can apply to it.",
      "2. The service is not a recruitment agency or a staffing service. The operator has no relationship with the employer named in a listing, does not verify listings, and guarantees no outcome.",
      "3. User content. The user publishing a listing is responsible for having the right to share the information and for not breaching confidentiality or other obligations.",
      "4. Prohibited: false listings, posting on behalf of someone else, unlawful or offensive content, bulk or automated use, submitting third parties' data without authorisation.",
      "5. Moderation. The operator may hide any listing and ban any account when these terms are breached.",
      "6. Liability is limited to the narrowest extent permitted by law; the operator is not liable for the outcome of contacts between users.",
      "7. The service is free and the operator may amend these terms.",
      "8. Contact: hello@utodom.hu",
    ],
  },
  privacy: {
    title: "Privacy notice (draft)",
    body: [
      "This document is a draft and must be reviewed by a lawyer before launch.",
      "Data processed — advertiser: email address, name (and photo if provided), the content of the listing. Legal basis: performance of a contract (GDPR Art. 6(1)(b)).",
      "Data processed — applicant: email address, LinkedIn profile URL, introduction, optionally salary expectation and notice period. This data, including your email address, is shared with the advertiser.",
      "Login: passwordless, via a link emailed to you. We use a session cookie to keep you logged in.",
      "Retention: data is kept until you delete your account. Deleting the account permanently removes all data and listings. The content of a closed listing is removed.",
      "Processors: hosting and transactional email providers (current list available on request).",
      "Your rights: access, rectification, erasure, restriction, objection, portability, and complaint to the supervisory authority.",
      "Contact: hello@utodom.hu",
    ],
  },
  cookies: {
    title: "Cookie notice (draft)",
    body: [
      "We only use strictly necessary cookies: one session cookie to keep you logged in.",
      "We use no advertising or profiling cookies. For traffic statistics we plan to use a cookie-free analytics tool.",
      "The session cookie expires on logout, or after 60 days at the latest.",
    ],
  },
};

export function getPages(locale: string): Pages {
  return locale === "en" ? en : hu;
}
