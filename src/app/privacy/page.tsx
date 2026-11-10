import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "Club Atlas Privacy Notice — Draft for legal review",
};
export default function Privacy() {
  return (
    <>
      <section className="wrap subhero">
        <p className="kicker">TRANSPARENCY</p>
        <h1>Your privacy is part of the project.</h1>
        <p>Draft for legal review. Subject to final legal approval before launch.</p>
      </section>
      <article className="wrap privacy">
        <div className="notice">
          This version is an engineering draft and does not replace the final LGPD-compliant policy. 
          The registration form remains disabled until legal and technical approval.
        </div>

        <h2>Data We Plan to Collect</h2>
        <p>
          Name, email, area of interest, device type, consent, and minimal operational registration data. 
          Training and community data will have additional notices when those modules become available.
        </p>

        <h2>Purpose</h2>
        <p>
          Respond to interest requests for the Club, send requested related information, 
          and prepare educational offerings — without sharing data for third-party advertising.
        </p>

        <h2>Access and Retention</h2>
        <p>
          Access limited to authorized personnel. Retention period and legal basis will be defined 
          before operations begin. Access and deletion requests will be handled through official 
          channels to be published after approval.
        </p>

        <h2>External Communities</h2>
        <p>
          Participating in a WhatsApp group may involve visibility of your phone number to other members. 
          Telegram and Discord also apply their own policies and terms. Participation is voluntary.
        </p>

        <h2>Digital Personas</h2>
        <p>
          Atlas, Lucas, Marta, and Bia are synthetic identities. 
          No agent will have implicit authorization to copy private member memories to others 
          or for external training.
        </p>

        <h2>Your Rights (LGPD)</h2>
        <p>
          Under Brazil's General Data Protection Law (LGPD), you have the right to:
        </p>
        <ul>
          <li>Confirm the existence of processing</li>
          <li>Access your data</li>
          <li>Correct incomplete, inaccurate, or outdated data</li>
          <li>Anonymize, block, or delete unnecessary or excessive data</li>
          <li>Port your data to another provider</li>
          <li>Delete data processed with your consent</li>
          <li>Information about entities with which data is shared</li>
          <li>Information about the possibility of denying consent and consequences</li>
          <li>Revoke consent</li>
        </ul>

        <h2>Contact</h2>
        <p>
          Data protection questions: <a href="mailto:privacy@atlashub.si">privacy@atlashub.si</a>
        </p>
      </article>
    </>
  );
}