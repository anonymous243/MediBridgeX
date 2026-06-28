import { ComingSoonPage } from "@/components/landing/ComingSoonPage";

export default function MessagePipelinePage() {
  return (
    <ComingSoonPage
      badge="Coming Soon"
      title="Message Pipeline"
      subtitle="Legacy HL7 processing engine."
      description="The Message Pipeline workspace is currently being built. It will provide a fully managed environment for parsing, validating, transforming, and routing HL7 v2.x messages in real time — with deep observability and alerting built in."
    />
  );
}
