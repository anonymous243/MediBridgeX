"use client";

import React, { useEffect, useState } from "react";

export default function HmsProductPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <iframe 
                src="http://localhost:5000" 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                title="HMS Engine"
            />
        </div>
    );
}
