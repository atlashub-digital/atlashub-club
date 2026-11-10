import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Club Atlas Terms of Use — Draft for legal review",
};
export default function Terms() {
  return (
    <>
      <section className="wrap subhero">
        <p className="kicker">LEGAL</p>
        <h1>Terms of Use</h1>
        <p>Draft for legal review. Subject to final legal approval before launch.</p>
      </section>
      <article className="wrap privacy">
        <div className="notice">
          This version is an engineering draft and does not replace the final legal terms. 
          The registration form remains disabled until legal and technical approval.
        </div>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Club Atlas ("the Club"), you agree to be bound by these Terms of Use. 
          If you do not agree with any part of these terms, you may not use the Club.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Club Atlas is a community and learning platform for building with AI agents. 
          It includes free community access, guided programs (such as Genesis), 
          experimental labs (Atlas Lab), and educational resources.
        </p>

        <h2>3. Eligibility</h2>
        <p>
          You must be at least 16 years old to use the Club. 
          By using the Club, you represent and warrant that you meet this requirement.
        </p>

        <h2>4. User Accounts</h2>
        <p>
          Some features may require account creation. You are responsible for maintaining 
          the confidentiality of your account credentials and for all activities under your account.
        </p>

        <h2>5. Digital Personas</h2>
        <p>
          Atlas, Lucas, Marta, and Bia are synthetic digital personas. 
          They are clearly identified as such and do not have implicit authorization 
          to copy private member memories or use them for external training.
        </p>

        <h2>6. Community Guidelines</h2>
        <p>
          Members are expected to treat each other with respect. Harassment, hate speech, 
          spam, and illegal activities are prohibited. We reserve the right to moderate 
          content and suspend accounts that violate these guidelines.
        </p>

        <h2>7. Intellectual Property</h2>
        <p>
          Club Atlas content, branding, and digital personas are owned by AtlasHub.SI. 
          Member-generated content remains owned by the member, 
          with a license granted to AtlasHub.SI for platform operation.
        </p>

        <h2>8. Paid Programs</h2>
        <p>
          Certain programs (e.g., Genesis) may require payment. 
          Pricing, refund policies, and terms will be clearly communicated before purchase. 
          No charges occur without explicit consent.
        </p>

        <h2>9. Disclaimers</h2>
        <p>
          The Club is provided "as is" without warranties of any kind. 
          AtlasHub.SI does not guarantee uninterrupted or error-free access. 
          AI-generated content may contain inaccuracies.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, AtlasHub.SI shall not be liable 
          for indirect, incidental, or consequential damages arising from use of the Club.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These terms are governed by the laws of Brazil. 
          Disputes shall be resolved in the courts of Anápolis, Goiás.
        </p>

        <h2>12. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. 
          Continued use after changes constitutes acceptance of the new terms.
        </p>

        <h2>13. Contact</h2>
        <p>
          Questions about these terms: <a href="mailto:legal@atlashub.si">legal@atlashub.si</a>
        </p>
      </article>
    </>
  );
}