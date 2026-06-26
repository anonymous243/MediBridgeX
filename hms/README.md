# MediCore HMS — Hospital Management System

A complete web application built with Python (Flask) + SQLite.
No external database needed — everything runs locally.

## Features
- **Dashboard**     — KPIs, today's appointments, patients by department
- **Patients**      — Register, search, edit, delete patient records
- **Appointments**  — Schedule & manage appointments by date
- **Billing**       — Create invoices, track payments, view outstanding
- **Inventory**     — Track medicines & supplies, get low-stock alerts

## Setup (3 steps)

```bash
# 1. Install Flask (only needed once)
pip install flask

# 2. Start the server
python app.py

# 3. Open your browser
#    http://localhost:5000
```

The database (hms.db) is created automatically on first run with sample data.

## Project structure

```
hms/
├── app.py                  ← All Python logic (routes, database)
├── hms.db                  ← SQLite database (auto-created)
├── templates/
│   ├── base.html           ← Shared layout with sidebar
│   ├── dashboard.html
│   ├── patients.html
│   ├── patient_form.html
│   ├── appointments.html
│   ├── appointment_form.html
│   ├── billing.html
│   ├── bill_form.html
│   ├── inventory.html
│   └── inventory_form.html
└── static/
    └── css/
        └── style.css
```

## Tech stack
- **Backend**  : Python 3 + Flask
- **Database** : SQLite (built into Python, no install needed)
- **Frontend** : Plain HTML + CSS (no JS frameworks)
