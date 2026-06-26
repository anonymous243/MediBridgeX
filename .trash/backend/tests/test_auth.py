import pytest
import pytest_asyncio
from sqlalchemy.future import select
from app.models.all_models import User, OTPVerification
from tests.conftest import TestingSessionLocal

@pytest_asyncio.fixture
async def db_session():
    async with TestingSessionLocal() as session:
        yield session

@pytest.mark.asyncio
async def test_signup_creates_unverified_user_and_otp(async_client, db_session):
    # Perform signup
    signup_data = {
        "email": "test-signup@example.com",
        "password": "strongPassword123",
        "fullName": "Test Signup User"
    }
    response = await async_client.post("/api/v1/auth/signup", json=signup_data)
    assert response.status_code == 200
    assert "Account created" in response.json()["message"]

    # Verify user exists and is unverified in DB
    result = await db_session.execute(select(User).where(User.email == signup_data["email"]))
    user = result.scalars().first()
    assert user is not None
    assert user.is_verified is False

    # Verify OTP record exists in DB
    otp_result = await db_session.execute(select(OTPVerification).where(OTPVerification.email == signup_data["email"]))
    otp_record = otp_result.scalars().first()
    assert otp_record is not None
    assert len(otp_record.otp_code) == 6

@pytest.mark.asyncio
async def test_verify_otp_success(async_client, db_session):
    # Perform signup first
    email = "test-verify@example.com"
    signup_data = {
        "email": email,
        "password": "strongPassword123",
        "fullName": "Test Verify User"
    }
    await async_client.post("/api/v1/auth/signup", json=signup_data)

    # Retrieve generated OTP from DB
    otp_result = await db_session.execute(select(OTPVerification).where(OTPVerification.email == email))
    otp_record = otp_result.scalars().first()
    otp_code = otp_record.otp_code

    # Verify OTP
    verify_data = {
        "email": email,
        "otp_code": otp_code
    }
    response = await async_client.post("/api/v1/auth/verify-otp", json=verify_data)
    assert response.status_code == 200
    
    # Session response should contain user details and JWT token
    json_data = response.json()
    assert "token" in json_data
    assert json_data["user"]["email"] == email
    
    # DB user should now be verified and OTP record deleted
    user_result = await db_session.execute(select(User).where(User.email == email))
    user = user_result.scalars().first()
    assert user.is_verified is True

    otp_check = (await db_session.execute(select(OTPVerification).where(OTPVerification.email == email))).scalars().first()
    assert otp_check is None

@pytest.mark.asyncio
async def test_verify_otp_failure(async_client):
    email = "test-fail@example.com"
    signup_data = {
        "email": email,
        "password": "strongPassword123",
        "fullName": "Test Fail User"
    }
    await async_client.post("/api/v1/auth/signup", json=signup_data)

    # Verify with invalid OTP code
    verify_data = {
        "email": email,
        "otp_code": "000000"
    }
    response = await async_client.post("/api/v1/auth/verify-otp", json=verify_data)
    assert response.status_code == 400
    assert "Invalid or expired OTP" in response.json()["detail"]

@pytest.mark.asyncio
async def test_unverified_login_attempts_blocked(async_client):
    email = "test-blocked@example.com"
    password = "strongPassword123"
    signup_data = {
        "email": email,
        "password": password,
        "fullName": "Test Blocked User"
    }
    await async_client.post("/api/v1/auth/signup", json=signup_data)

    # Attempt to login before verifying email
    login_data = {
        "email": email,
        "password": password
    }
    response = await async_client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 403
    assert response.json()["detail"] == "UNVERIFIED_EMAIL"
