import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const footerLinks = [
  {
    title: "Product",
    links: [

      { name: "FHIR API Gateway", href: "/product/fhir-gateway" },
      { name: "Legacy Connectors", href: "/" },
      { name: "Data Transformation", href: "/" },
      { name: "Security & HIPAA", href: "/" },
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
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },

      { name: "Contact Sales", href: "/contact" },
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
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-start">
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
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </SocialLink>
              <SocialLink href="/" label="GitHub">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </SocialLink>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1 md:col-span-2">
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