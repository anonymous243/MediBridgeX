import { redirect } from 'next/navigation';

export default function DashboardIndex() {
  // Redirect to the FHIR workspace as the default dashboard view
  redirect('/dashboard/fhir');
}
