from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, field_validator


class Patient(BaseModel):
    id: str
    name: str | None = None


class PatientCreate(BaseModel):
    external_id: str | None = None
    name: str
    dob: date
    gender: Literal["male", "female", "other", "unknown"]
    phone: str | None = None
    address: str | None = None

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, value: str) -> str:
        cleaned_name = value.strip()
        if not cleaned_name:
            raise ValueError("name cannot be empty")
        return cleaned_name

    @field_validator("gender", mode="before")
    @classmethod
    def normalize_gender(cls, value: Any) -> Any:
        if isinstance(value, str):
            return value.strip().lower()
        return value
