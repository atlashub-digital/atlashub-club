"use client";

import { useEffect, useState } from "react";
import styles from "./sales.module.css";

export default function StickyOffer({ price }: { price: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("course-intro");
    const offer = document.getElementById("inscricao");
    if (!hero || !offer || !("IntersectionObserver" in window)) return;
    let pastHero = false;
    let offerVisible = false;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        if (entry.target === offer) offerVisible = entry.isIntersecting;
      }
      setVisible(pastHero && !offerVisible);
    });
    observer.observe(hero);
    observer.observe(offer);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;
  return <nav className={styles.stickyOffer} aria-label="Participação no atelier"><div><strong>{price}</strong><span>Atelier F01 · pagamento único</span></div><a href="#inscricao">Conhecer a formação <span aria-hidden="true">↗</span></a></nav>;
}
