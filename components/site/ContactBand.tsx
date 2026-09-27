import Link from "next/link";

export default function ContactBand() {
  return <section className="contact-band"><p className="kicker">Distributor or operator?</p><h2>Let’s build what’s next.</h2><Link className="arrow-button light" href="/contact-sales">Get in touch <span aria-hidden="true">↗</span></Link></section>;
}
