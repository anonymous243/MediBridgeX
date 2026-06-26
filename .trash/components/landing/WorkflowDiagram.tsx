import { Logo } from "@/components/ui/logo";

export function WorkflowDiagram() {
  return (
    <div className="relative w-full max-w-[640px] select-none ml-[-180px]">
      {/* Top labels */}
      <div className="flex justify-between mb-4 px-1">
        <span className="text-[11px] font-bold text-pink-500 tracking-widest uppercase">
          Legacy Systems
        </span>
        <span className="text-[11px] font-bold text-blue-500 tracking-widest uppercase" style={{ marginRight: '-200px' }}>
          Modern Applications
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* ── Legacy Systems ── */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          {[
            {
              label: "EHR Systems",
              icon: (
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 7h16M4 11h16M4 15h10M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" />
                </svg>
              ),
            },
            {
              label: "Laboratory Systems",
              icon: (
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 3v9l-4 7h14l-4-7V3M9 3h6" />
                </svg>
              ),
            },
            {
              label: "Imaging Systems",
              icon: (
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth={1.5} />
                  <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
                </svg>
              ),
            },
          ].map(({ label, icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm w-40"
            >
              {icon}
              <span className="text-xs text-gray-700 font-medium leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* ── HL7 connector ── */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="h-px w-3 bg-pink-400" />
          <span className="text-[10px] font-bold text-white bg-pink-500 rounded px-1.5 py-0.5 shadow-sm">
            HL7
          </span>
          <div className="flex gap-0.5 items-center">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-pink-300"
                style={{ opacity: 1 - i * 0.12 }}
              />
            ))}
          </div>
        </div>

        {/* ── Center Engine Card ── */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0">
          {/* Card */}
          <div className="w-40 h-40 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center justify-center gap-1.5 p-4">
            <Logo size={28} showText={true} layout="vertical" />
          </div>

          {/* Capability Icons */}
          <div className="flex gap-8">
            {[
              {
                label: "Validation",
                icon: (
                  <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ),
              },
              {
                label: "Mapping",
                icon: (
                  <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                ),
              },
              {
                label: "Transformation",
                icon: (
                  <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
              },
              {
                label: "Routing",
                icon: (
                  <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
              },
              {
                label: "Monitoring",
                icon: (
                  <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 21h8m-4-4v4" />
                  </svg>
                ),
              },
            ].map(({ label, icon }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                {icon}
                <span className="text-[8px] text-gray-400 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FHIR connector ── */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="flex gap-0.5 items-center">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-blue-300"
                style={{ opacity: 0.25 + i * 0.12 }}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-white bg-blue-500 rounded px-1.5 py-0.5 shadow-sm">
            FHIR
          </span>
          <div className="h-px w-2 bg-blue-400" />
        </div>

        {/* ── Modern Applications ── */}
        <div
          className="flex flex-col gap-3 flex-shrink-0"
          style={{ marginLeft: '2px' }}
        >
          {[
            {
              label: "FHIR APIs",
              icon: (
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.974 7.974 0 01-2.343 5.657z" />
                </svg>
              ),
            },
            {
              label: "Healthcare Apps",
              icon: (
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth={1.5} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01" />
                </svg>
              ),
            },
            {
              label: "Analytics Platforms",
              icon: (
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
            },
          ].map(({ label, icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm w-40"
            >
              {icon}
              <span className="text-xs text-gray-700 font-medium leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}