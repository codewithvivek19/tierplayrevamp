import Link from "next/link";

export default function ContactBand() {
  return <section className="contact-band"><p className="kicker">For distributors and operators</p><h2>Talk to Tierplay.</h2><Link className="arrow-button light" href="/contact-sales">Contact sales <span aria-hidden="true">↗</span></Link></section>;
}
