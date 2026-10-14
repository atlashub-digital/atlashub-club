import { faq } from "@/lib/content";

/** FAQ com <details>/<summary>: acessível por teclado e funciona sem JavaScript. */
export default function Faq() {
  return (
    <div className="ca-faq">
      {faq.map((item) => (
        <details key={item.q} className="ca-faq__item">
          <summary>
            <span>{item.q}</span>
            <span className="ca-faq__chev" aria-hidden="true" />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
