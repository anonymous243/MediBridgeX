DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'fhirbridge') THEN
      CREATE ROLE fhirbridge LOGIN PASSWORD 'fhirbridge';
   END IF;
END
$$;

SELECT 'CREATE DATABASE fhirbridge OWNER fhirbridge'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fhirbridge')\gexec

