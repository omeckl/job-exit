import { Resend } from "resend";

type Mail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

const from = process.env.EMAIL_FROM ?? "utodom.hu <onboarding@resend.dev>";

export async function sendMail({ to, subject, text, replyTo }: Mail) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[email:dev] to=${to} subject=${subject}\n${text}`);
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({ from, to, subject, text, replyTo });
}

export async function sendLoginEmail(to: string, link: string, locale: string) {
  const hungarian = locale !== "en";
  await sendMail({
    to,
    subject: hungarian ? "Belépő link — utodom.hu" : "Your login link — utodom.hu",
    text: hungarian
      ? `Kattints a linkre a belépéshez:\n\n${link}\n\nA link 30 percig érvényes.`
      : `Click the link to log in:\n\n${link}\n\nThe link is valid for 30 minutes.`,
  });
}

export async function sendNewApplicationEmail(to: string, listingTitle: string, url: string, locale: string) {
  const hungarian = locale !== "en";
  await sendMail({
    to,
    subject: hungarian ? `Új jelentkező: ${listingTitle}` : `New applicant: ${listingTitle}`,
    text: hungarian
      ? `Valaki jelentkezett a hirdetésedre (${listingTitle}).\n\nNézd meg itt: ${url}`
      : `Someone applied to your listing (${listingTitle}).\n\nSee it here: ${url}`,
  });
}

export async function sendHandoverEmail(
  to: string,
  listingTitle: string,
  message: string,
  senderName: string,
  senderEmail: string,
  locale: string,
) {
  const hungarian = locale !== "en";
  await sendMail({
    to,
    replyTo: senderEmail,
    subject: hungarian ? `Átadó üzenet: ${listingTitle}` : `Handover message: ${listingTitle}`,
    text: hungarian
      ? `${senderName} üzenete a(z) "${listingTitle}" pozícióról:\n\n${message}\n\nVálaszolhatsz közvetlenül erre az e-mailre.`
      : `${senderName} wrote about the "${listingTitle}" position:\n\n${message}\n\nYou can reply directly to this email.`,
  });
}

export async function sendClosingReminderEmail(to: string, listingTitle: string, url: string, locale: string) {
  const hungarian = locale !== "en";
  await sendMail({
    to,
    subject: hungarian ? `A hirdetésed hamarosan lezárul: ${listingTitle}` : `Your listing closes soon: ${listingTitle}`,
    text: hungarian
      ? `A(z) "${listingTitle}" hirdetésed 7 nap múlva automatikusan lezárul.\n\n${url}`
      : `Your listing "${listingTitle}" closes automatically in 7 days.\n\n${url}`,
  });
}

export async function sendClosingSummaryEmail(
  to: string,
  listingTitle: string,
  stats: { views: number; applications: number; handovers: number },
  locale: string,
) {
  const hungarian = locale !== "en";
  await sendMail({
    to,
    subject: hungarian ? `Lezárult: ${listingTitle}` : `Closed: ${listingTitle}`,
    text: hungarian
      ? `A(z) "${listingTitle}" hirdetésed lezárult.\n\n${stats.views} megtekintés\n${stats.applications} jelentkezés\n${stats.handovers} átadó üzenet`
      : `Your listing "${listingTitle}" is closed.\n\n${stats.views} views\n${stats.applications} applications\n${stats.handovers} handover messages`,
  });
}

export async function sendDigestEmail(to: string, lines: string[], url: string, locale: string) {
  const hungarian = locale !== "en";
  await sendMail({
    to,
    subject: hungarian ? "Új pozíciók a mentett keresésedhez" : "New positions for your saved search",
    text: `${lines.join("\n")}\n\n${url}`,
  });
}
