"use client";

import React, { useState } from 'react';
import { PageContainer } from '@/components/dashboard/PageContainer';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { FhirMetrics } from '@/components/fhir/FhirMetrics';
import { ResourceFilters } from '@/components/fhir/ResourceFilters';
import { ResourceTable } from '@/components/fhir/ResourceTable';
import { ResourceDrawer } from '@/components/fhir/ResourceDrawer';
import { FhirResource } from '@/types/fhir';
import { Database } from 'lucide-react';

export default function FhirWorkspacePage() {
    const [selectedResource, setSelectedResource] = useState<FhirResource | null>(null);

    return (
        <PageContainer>
            <SectionHeader 
                title="FHIR Interoperability" 
                description="Monitor, validate, and route HL7 FHIR R4 resources across your infrastructure."
            />

            <FhirMetrics />
            
            <ResourceFilters />

            <ResourceTable onResourceClick={(resource) => setSelectedResource(resource)} />

            <ResourceDrawer 
                resource={selectedResource} 
                open={!!selectedResource} 
                onClose={() => setSelectedResource(null)} 
            />
        </PageContainer>
    );
}
