export default function MediaSlot({ kind, label, detail }: { kind: "VIDEO" | "3D"; label: string; detail: string }) {
  return (
    <div className="media-slot" data-kind={kind} role="note" aria-label={`${kind} production slot: ${label}`}>
      <span className="media-slot-icon" aria-hidden="true">{kind === "VIDEO" ? "▶" : "◇"}</span>
      <span><b>{kind} SLOT</b>{label}</span>
      <small>{detail}</small>
    </div>
  );
}
