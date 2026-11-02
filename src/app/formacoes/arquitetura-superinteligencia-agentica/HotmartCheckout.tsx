"use client";

import Script from "next/script";
import { createContext, useContext, useRef, useState, type MouseEvent, type ReactNode } from "react";
import styles from "./sales.module.css";

type CheckoutInstance = { mount: (target: HTMLElement) => void };
type CheckoutSdk = { init: (type: "inlineCheckout", options: { offer: string; onLoadDataError: () => void }) => CheckoutInstance };
declare global { interface Window { checkoutElements?: CheckoutSdk } }

const CheckoutContext = createContext<((event: MouseEvent<HTMLAnchorElement>) => void) | undefined>(undefined);

export function HotmartCheckoutProvider({ children, checkoutUrl, offerCode }: { children: ReactNode; checkoutUrl: string; offerCode: string }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const instance = useRef<CheckoutInstance | null>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);

  function open(event: MouseEvent<HTMLAnchorElement>) {
    if (!ready || !window.checkoutElements || !dialog.current || !mount.current) return;
    try {
      if (!instance.current) {
        instance.current = window.checkoutElements.init("inlineCheckout", { offer: offerCode, onLoadDataError: () => setError(true) });
        instance.current.mount(mount.current);
        mount.current.querySelector("iframe")?.setAttribute("title", "Pagamento seguro da formação na Hotmart");
      }
      dialog.current.showModal();
      trigger.current = event.currentTarget;
      event.preventDefault();
    } catch {
      // O link HTML continua a funcionar quando a biblioteca não está disponível.
      instance.current = null;
      setReady(false);
    }
  }

  return <CheckoutContext.Provider value={open}>
    {children}
    <Script id="hotmart-checkout-elements" src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js" strategy="afterInteractive" onReady={() => setReady(true)} onError={() => setReady(false)} />
    <dialog ref={dialog} className={styles.checkoutDialog} aria-labelledby="hotmart-dialog-title" onClose={() => trigger.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className={styles.checkoutShell}>
        <header><div><strong id="hotmart-dialog-title">Sua inscrição na Hotmart</strong><p>Pagamento processado na interface segura da Hotmart.</p></div><button type="button" onClick={() => dialog.current?.close()} aria-label="Fechar pagamento">✕</button></header>
        <div className={styles.checkoutScroll}>{error && <p role="status" className={styles.checkoutError}>Não foi possível carregar o pagamento aqui. Use o link direto abaixo.</p>}<div ref={mount} /></div>
        <footer><a href={checkoutUrl} target="_blank" rel="noopener noreferrer">Abrir checkout direto em nova aba ↗</a></footer>
      </div>
    </dialog>
  </CheckoutContext.Provider>;
}

export function HotmartCheckoutButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const open = useContext(CheckoutContext);
  return <a href={href} className={["ca-btn ca-btn--gold", className].join(" ")} onClick={open}>{children}<span aria-hidden="true">↗</span></a>;
}
