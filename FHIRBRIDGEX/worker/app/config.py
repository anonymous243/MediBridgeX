from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://fhirbridge:fhirbridge@localhost:5432/fhirbridge"
    rabbitmq_url: str = "amqp://guest:guest@localhost:5672/"
    hl7_queue_name: str = "hl7_messages"
    fhir_auto_submit_enabled: bool = True
    fhir_auto_submit_endpoints: str = "https://hapi.fhir.org/baseR4"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
