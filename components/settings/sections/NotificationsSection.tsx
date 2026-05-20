'use client';

import React, { useState } from 'react';
import { Mail, Bell, Activity, ShieldAlert, Zap, Globe, FileText, Database } from 'lucide-react';
import { SettingsCard } from '../SettingsCard';
import { SettingsSection } from '../SettingsSection';
import { NotificationToggle } from '../NotificationToggle';

export function NotificationsSection() {
  const [emailDigest, setEmailDigest] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [fhirSync, setFhirSync] = useState(false);
  const [webhookFailures, setWebhookFailures] = useState(true);
  const [auditLogins, setAuditLogins] = useState(false);
  const [complianceReports, setComplianceReports] = useState(true);

  return (
    <SettingsSection 
      title="Notification Settings" 
      description="Configure how your team receives infrastructure alerts, clinical feed status, and compliance reports."
    >
      <SettingsCard title="Infrastructure Alerts" description="Stay informed about the health of your healthcare network pipes.">
        <div className="space-y-4">
          <NotificationToggle 
            title="System Critical Failures" 
            description="Immediate alerts when FHIR pipes or HL7 processors encounter high-latency or downtime."
            icon={ShieldAlert}
            enabled={systemAlerts}
            onChange={setSystemAlerts}
          />
          <NotificationToggle 
            title="Webhook Delivery Failures" 
            description="Receive notifications when outbound webhooks fail to reach your external clinical endpoints."
            icon={Zap}
            enabled={webhookFailures}
            onChange={setWebhookFailures}
          />
          <NotificationToggle 
            title="FHIR Sync Latency" 
            description="Alert when clinical data synchronization exceeds the 500ms enterprise threshold."
            icon={Database}
            enabled={fhirSync}
            onChange={setFhirSync}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Compliance & Audit" description="Manage reports and security event notifications.">
        <div className="space-y-4">
          <NotificationToggle 
            title="Organization Audit Reports" 
            description="Weekly automated CSV reports containing all administrative actions and data access logs."
            icon={FileText}
            enabled={complianceReports}
            onChange={setComplianceReports}
          />
          <NotificationToggle 
            title="New Sign-in Alerts" 
            description="Notify administrators whenever a new device or IP address accesses the organization workspace."
            icon={Globe}
            enabled={auditLogins}
            onChange={setAuditLogins}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Email Preferences" description="Global email communication settings for your account.">
        <div className="space-y-4">
          <NotificationToggle 
            title="Daily Performance Digest" 
            description="A summarized morning report of clinical throughput and message processing efficiency."
            icon={Mail}
            enabled={emailDigest}
            onChange={setEmailDigest}
          />
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}
