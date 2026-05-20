export const appConfig = {
    name: 'MediBridgeX',

    description:
        'Healthcare interoperability infrastructure platform.',

    version: '1.0.0',

    company: {
        name: 'MediBridgeX',
    },

    api: {
        baseUrl:
            process.env.NEXT_PUBLIC_API_URL ||
            'http://localhost:8000',
    },

    dashboard: {
        defaultPageSize: 10,
    },
} as const;