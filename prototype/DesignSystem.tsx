"use client";
import { useRef, useState, type FormEvent } from "react";
import styles from "./prototype.module.css";
import lab from "./system.module.css";
export default function DesignSystem() {
  const [tab, setTab] = useState("Cabinet");
  const [status, setStatus] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const tabs = ["Cabinet", "Display", "Controls"];
  const descriptions: Record<string, string> = {
    Cabinet: "A physical product, clearly presented. Model information stays readable outside the 3D scene.",
    Display: "A separate media surface. Screen content must be approved and mapped to the correct game.",
    Controls: "Keyboard, mouse and touch share the same actions. Focus is distinct from entering the screen.",
  };
  const validate = (event: FormEvent) => {
    event.preventDefault();
    if (form.current?.reportValidity()) setStatus("Fields are valid. This interface study has not sent or saved your information.");
  };
  return <div className={styles.shell}>
    <a className={styles.skip} href="#system-main">Skip to interface system</a>
    <header className={styles.header}><a href="/prototype-01" aria-label="Tierplay prototype"><img className={styles.logo} src="/media/tierplay.svg" alt="Tierplay" width="150" height="46" /></a><span className={styles.edition}>INTERFACE SYSTEM <span>M02</span></span><a className={styles.textButton} href="/prototype-01">Back to prototype ↗</a></header>
    <main id="system-main" className={styles.main}>
      <div className={styles.intro}><p className={styles.kicker}><span /> DESIGN SYSTEM / WORKING STUDY</p><h1>PRECISION.<br /><span>IN EVERY DETAIL.</span></h1><p className={styles.lead}>A shared language for product, motion and interaction.<br />Isolated controls for review before the full experience.</p></div>
      <section className={lab.section} aria-labelledby="type-title"><p className={lab.index}>01 / TYPE</p><div><h2 id="type-title">One clear hierarchy.</h2><div className={lab.typeDisplay}>ENGINEERED<br />FOR PLAY.</div><p className={lab.bodySample}>Product information belongs in readable, selectable text. Display typography carries the statement; restrained body type carries the detail.</p><p className={lab.caption}>MANROPE / BODY + INTERFACE · BARLOW CONDENSED / DISPLAY</p></div></section>
      <section className={lab.section} aria-labelledby="color-title"><p className={lab.index}>02 / COLOR</p><div><h2 id="color-title">Controlled contrast.</h2><div className={lab.palette}>{[["Graphite", "#171a18"], ["Paper", "#eae9e3"], ["Secondary", "#555b55"], ["Signal", "#bb331e"]].map(([name,color])=><div key={name}><span style={{background:color}} /><strong>{name}</strong><p>{color}</p></div>)}</div><p className={lab.bodySample}>Color signals an action or a product state. Game artwork supplies its own accent; the interface stays coherent.</p></div></section>
      <section className={lab.section} aria-labelledby="control-title"><p className={lab.index}>03 / INTERACTION</p><div><h2 id="control-title">Focus before entry.</h2><div className={lab.tabs} role="tablist" aria-label="Cabinet information">{tabs.map((name,i)=><button role="tab" id={`tab-${name}`} aria-controls="study-panel" aria-selected={tab===name} tabIndex={tab===name?0:-1} key={name} onClick={()=>setTab(name)} onKeyDown={(event)=>{if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:(i+(event.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;setTab(tabs[next]);document.getElementById(`tab-${tabs[next]}`)?.focus();}}>{name}</button>)}</div><div id="study-panel" role="tabpanel" tabIndex={0} aria-labelledby={`tab-${tab}`} className={lab.panel}><h3>{tab}</h3><p>{descriptions[tab]}</p></div><div className={lab.buttonRow}><a className={styles.primary} href="/prototype-01">Review prototype ↗</a><button className={styles.secondary} onClick={()=>setTab("Cabinet")}>Reset selection</button><button className={styles.primary} disabled>Awaiting asset</button></div><p className={lab.caption}>VISIBLE FOCUS · ARROW-KEY TABS · 48PX MINIMUM CONTROLS · NO HOVER-ONLY ACTIONS</p></div></section>
      <section className={lab.section} aria-labelledby="form-title"><p className={lab.index}>04 / CONVERSION</p><div><h2 id="form-title">Start a conversation.</h2><p className={lab.bodySample}>Lead-form interface study. Validation runs locally; nothing is sent or stored. The real delivery integration is still required.</p><form ref={form} onSubmit={validate} className={lab.form}>
        <label>Name<input name="name" autoComplete="name" /></label><label>Email <span>(required)</span><input name="email" type="email" required autoComplete="email" /></label><label>Company name<input name="company" autoComplete="organization" /></label><label>State<select name="state" defaultValue=""><option value="">Select state</option><option value="Arizona">Arizona</option></select></label>
        <fieldset><legend>What describes you best? <span>(required)</span></legend><div className={lab.roles}>{["Distributor","Operator","Location Owner","Other"].map(role=><label key={role}><input type="radio" name="role" value={role} required />{role}</label>)}</div></fieldset>
        <label className={lab.full}>Message<textarea name="message" rows={4} /></label><p className={`${lab.caption} ${lab.full}`}>STATE OPTIONS MATCH THE RECOVERED SOURCE. TERRITORIES REQUIRE CONFIRMATION.</p><button className={styles.primary} type="submit">Validate fields ↗</button><p className={lab.formStatus} role="status">{status}</p>
      </form></div></section>
    </main><footer className={styles.footer}><span>INTERFACE STUDY / NOT A LIVE CONTACT FORM</span><a href="/prototype-01">Prototype 01 ↗</a></footer>
  </div>;
}
