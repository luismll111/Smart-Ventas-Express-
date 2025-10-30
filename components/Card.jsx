export default function Card({ title, desc, href, cta }) {
  return (
    <a
      href={href}
      className="group block rounded-2xl border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 p-5 shadow-sm hover:shadow-lg transition"
    >
      <div className="text-base font-semibold">{title}</div>
      {desc && <p className="text-sm text-slate-600 mt-1">{desc}</p>}
      {cta && (
        <div className="inline-flex items-center gap-1 text-sm text-blue-600 mt-3">
          {cta} <span className="transition -translate-x-0 group-hover:translate-x-0.5">→</span>
        </div>
      )}
    </a>
  );
}
