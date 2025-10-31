export default function Card({ title, desc, href, cta }) {
  return (
    <a
      href={href}
      className="group block rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-200 hover:-translate-y-1"
    >
      <div className="text-base font-semibold text-slate-900">{title}</div>
      {desc && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{desc}</p>}
      {cta && (
        <div className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 mt-4">
          {cta} <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      )}
    </a>
  );
}
