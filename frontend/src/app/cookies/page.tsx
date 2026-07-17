import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ContentPage from "@/components/layout/ContentPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookie Policy | 3TATTAVA",
  description:
    "The cookies and similar technologies we use, why we use them, and the choices you control.",
  alternates: { canonical: "https://www.3tattava.com/cookies" },
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  margin: "0 0 18px",
  fontSize: 14,
};
const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "2px solid #cd872a",
  color: "#442a1b",
  fontWeight: 700,
  verticalAlign: "top",
};
const tdStyle: CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid #e4d6bf",
  color: "#6f5a48",
  verticalAlign: "top",
  lineHeight: 1.6,
};

export default function CookiePolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Cookie Policy"
      updated="17 July 2026"
      intro="Cookies and similar technologies we use, why we use them, and the choices you control."
    >
      <h2>1. What cookies are</h2>
      <p>
        Cookies are small text files stored on a browser or device. Similar
        technologies include local storage, pixels, software-development kits
        and tags. They can support website functions, remember choices, measure
        use and, where permitted, help measure or personalise advertising.
      </p>

      <h2>2. Cookies we may use</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Purpose</th>
            <th style={thStyle}>Choice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>Strictly necessary</td>
            <td style={tdStyle}>
              Security, fraud prevention, load balancing, shopping cart,
              checkout, session management and recording privacy/cookie choices
            </td>
            <td style={tdStyle}>
              Required for core functions; cannot ordinarily be disabled through
              our preference tool
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>Functional</td>
            <td style={tdStyle}>
              Remember language, location, display or support preferences
            </td>
            <td style={tdStyle}>
              Used according to the choice presented where required
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>Analytics and performance</td>
            <td style={tdStyle}>
              Understand visits, page use, errors, traffic sources and website
              performance in aggregated or pseudonymous form
            </td>
            <td style={tdStyle}>
              Non-essential; used only after the required affirmative choice
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>Advertising and measurement</td>
            <td style={tdStyle}>
              Measure campaigns, control ad frequency or build audiences across
              services
            </td>
            <td style={tdStyle}>
              Non-essential; used only after the required affirmative choice
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Depending on the tools enabled on the website, third-party providers may
        include commerce/hosting providers, payment providers, communication
        tools, Google services, Meta services or other vendors identified in the
        cookie preference interface. Third parties may place or read their own
        cookies under their published privacy terms.
      </p>

      <h2>3. Consent and controls</h2>
      <p>
        On your first relevant visit, we offer clear options to accept all
        non-essential cookies, reject non-essential cookies or manage
        categories. Non-essential consent is not inferred merely from continued
        browsing and does not use pre-ticked boxes.
      </p>
      <p>
        You can change a previous choice through the <strong>Cookie
        Settings</strong> link in the website footer. You may also block or
        delete cookies in browser settings. Blocking strictly necessary cookies
        may prevent login, cart, checkout, security or preference functions from
        working.
      </p>

      <h2>4. Retention</h2>
      <p>
        Session cookies expire when the browser session ends. Persistent-cookie
        duration depends on purpose and provider and is shown in the cookie
        preference interface where technically available. We review enabled
        cookies and do not retain them longer than reasonably necessary.
      </p>

      <h2>5. Do Not Track</h2>
      <p>
        Some browsers send a &quot;Do Not Track&quot; signal, but there is no
        single industry standard for responding to it. Use our Cookie Settings
        control for the choices we offer.
      </p>

      <h2>6. Changes and contact</h2>
      <p>
        We may update this Cookie Policy when technologies or legal requirements
        change. Questions may be sent to{" "}
        <a href={`mailto:${LEGAL.emailGeneral}`}>{LEGAL.emailGeneral}</a>.
      </p>
    </ContentPage>
  );
}
