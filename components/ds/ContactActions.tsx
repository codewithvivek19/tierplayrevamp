import Link from "next/link";
import { ArrowUpRight, Headset, Mail, MapPin, Phone } from "lucide-react";
import Magnet from "@/components/reactbits/Magnet";
import { company } from "@/content/site";

type Action = { kind: "email" | "phone" | "support" | "sales"; subject?: string };

const icons = { email: Mail, phone: Phone, support: Headset, sales: ArrowUpRight };

/** Large contact action cards (email/phone/links). No form: enquiries go straight to the team. */
export default function ContactActions({ actions }: { actions: Action[] }) {
  return <div className="ds-contact">
    {actions.map((action) => {
      const Icon = icons[action.kind];
      const body = {
        email: { label: "Email", value: company.email, href: `${company.emailHref}${action.subject ? `?subject=${encodeURIComponent(action.subject)}` : ""}` },
        phone: { label: "Call", value: company.phone, href: company.phoneHref },
        support: { label: "Technical support", value: "Visit support", href: "/24-7-support" },
        sales: { label: "Sales enquiries", value: "Contact sales", href: "/contact-sales" },
      }[action.kind];
      const inner = <>
        <span className="ds-contact__icon"><Icon aria-hidden="true" size={18} strokeWidth={1.5} /></span>
        <span className="ds-contact__label">{body.label}</span>
        <Magnet strength={7}><b className="ds-contact__value">{body.value}</b></Magnet>
        <ArrowUpRight className="ds-contact__arrow" aria-hidden="true" size={18} strokeWidth={1.5} />
      </>;
      return body.href.startsWith("/")
        ? <Link key={action.kind} className="ds-contact__item" href={body.href}>{inner}</Link>
        : <a key={action.kind} className="ds-contact__item" href={body.href}>{inner}</a>;
    })}
    <div className="ds-contact__item ds-contact__item--static">
      <span className="ds-contact__icon"><MapPin aria-hidden="true" size={18} strokeWidth={1.5} /></span>
      <span className="ds-contact__label">Headquarters</span>
      <address className="ds-contact__value ds-contact__address">{company.address}</address>
    </div>
  </div>;
}
