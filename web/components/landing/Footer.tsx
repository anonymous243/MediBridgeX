import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Healthcare Management (HMS)", href: "/product/hms" },

      { name: "FHIR API Gateway", href: "/product/fhir-gateway" },
      { name: "Legacy Connectors", href: "/product/hl7" },
      { name: "Data Transformation", href: "/product/data-transformation" },
      { name: "Security & HIPAA", href: "/" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Mirth Connect", href: "/" },
      { name: "Corepoint", href: "/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/" },
      { name: "Developer Sandbox", href: "/auth/sign-in" },
      { name: "API Reference", href: "/" },
      { name: "HL7 to FHIR Guide", href: "/" },
      { name: "System Status", href: "/", status: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "HIPAA Compliance", href: "/hipaa" },
      { name: "Trust Center", href: "/trust" },
      { name: "Cookie Settings", href: "/cookies" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },

      { name: "Contact Sales", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 flex flex-col items-start">
            <Logo size={28} showText={true} layout="vertical" className="!items-start !text-left mb-6" />
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
              The modern interoperability layer for healthcare. Bridging the gap between legacy systems and FHIR-based innovation.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-5">
              <SocialLink href="https://www.linkedin.com/company/medibridgex/" label="LinkedIn">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </SocialLink>
              <SocialLink href="/" label="X">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" stroke="none" fill="currentColor" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </SocialLink>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1 lg:col-span-1">
              <h4 className="text-gray-900 font-bold text-sm mb-6 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-[#9d174d] text-sm transition-colors duration-200 flex items-center gap-2 group"
                    >
                      {link.name}
                      {link.status && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} MediBridgeX Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              All Systems Operational
            </span>
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-help opacity-50 hover:opacity-100" title="HIPAA Compliant">
                  <span className="text-[10px] font-black text-blue-600">HIPAA</span>
               </div>
               <div className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-help opacity-50 hover:opacity-100" title="SOC2 Type II">
                  <span className="text-[10px] font-black text-gray-800">SOC2</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, children, label }: { href: string; children: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#9d174d] hover:border-[#9d174d]/20 hover:bg-[#9d174d]/5 transition-all duration-300"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </Link>
  );
}