"""
HMS - Hospital Management System
Flask + SQLite backend
Run: python app.py
Open: http://localhost:5000
"""

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import sqlite3
import os
from datetime import datetime, date

app = Flask(__name__)
app.secret_key = "hms-secret-key-2026"

DB = "hms.db"

# ─────────────────────────────────────────────
# DATABASE SETUP
# ─────────────────────────────────────────────

def get_db():
    """Open a database connection."""
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row   # lets us use row["column"] instead of row[0]
    return conn


def init_db():
    """Create all tables and seed sample data if DB is new."""
    conn = get_db()
    c = conn.cursor()

    # ── Patients table ──────────────────────────────────────────────
    c.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            age         INTEGER NOT NULL,
            gender      TEXT    NOT NULL,
            phone       TEXT,
            email       TEXT,
            address     TEXT,
            department  TEXT,
            blood_group TEXT,
            status      TEXT    DEFAULT 'Active',
            created_at  TEXT    DEFAULT (date('now'))
        )
    """)

    # ── Appointments table ──────────────────────────────────────────
    c.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id   INTEGER NOT NULL,
            doctor       TEXT    NOT NULL,
            department   TEXT    NOT NULL,
            appt_date    TEXT    NOT NULL,
            appt_time    TEXT    NOT NULL,
            type         TEXT    DEFAULT 'Consultation',
            status       TEXT    DEFAULT 'Scheduled',
            notes        TEXT,
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    """)

    # ── Billing table ───────────────────────────────────────────────
    c.execute("""
        CREATE TABLE IF NOT EXISTS billing (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id   INTEGER NOT NULL,
            invoice_no   TEXT    NOT NULL,
            category     TEXT    NOT NULL,
            amount       REAL    NOT NULL,
            paid         REAL    DEFAULT 0,
            status       TEXT    DEFAULT 'Pending',
            bill_date    TEXT    DEFAULT (date('now')),
            notes        TEXT,
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    """)

    # ── Inventory table ─────────────────────────────────────────────
    c.execute("""
        CREATE TABLE IF NOT EXISTS inventory (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            item_name     TEXT    NOT NULL,
            category      TEXT    NOT NULL,
            quantity      INTEGER NOT NULL DEFAULT 0,
            unit          TEXT    NOT NULL DEFAULT 'Units',
            reorder_level INTEGER NOT NULL DEFAULT 10,
            unit_price    REAL    DEFAULT 0,
            supplier      TEXT,
            updated_at    TEXT    DEFAULT (date('now'))
        )
    """)

    conn.commit()

    # ── Seed data (only if tables are empty) ────────────────────────
    if c.execute("SELECT COUNT(*) FROM patients").fetchone()[0] == 0:
        _seed(c)
        conn.commit()

    conn.close()


def _seed(c):
    """Insert sample data so the app has something to show."""
    patients = [
        ("Priya Sharma",  38, "Female", "9876543210", "priya@email.com",  "12 MG Road, Bengaluru", "Cardiology",    "B+",  "Active"),
        ("Rajan Mehta",   55, "Male",   "9845001234", "rajan@email.com",  "45 JP Nagar, Bengaluru","Orthopaedics",  "O+",  "Follow-up"),
        ("Anita Rao",     62, "Female", "9900112233", "anita@email.com",  "7 Indiranagar, Bengaluru","Neurology",   "A-",  "Admitted"),
        ("Farhan Ali",    44, "Male",   "9812345670", "farhan@email.com", "22 Koramangala, Bengaluru","Cardiology",  "AB+", "Active"),
        ("Deepa Nair",     7, "Female", "9700001111", "deepa@email.com",  "5 Whitefield, Bengaluru", "Paediatrics", "O-",  "Active"),
        ("Suresh Kumar",  71, "Male",   "9988776655", "suresh@email.com", "8 Jayanagar, Bengaluru",  "Oncology",    "B-",  "Admitted"),
    ]
    c.executemany(
        "INSERT INTO patients (name,age,gender,phone,email,address,department,blood_group,status) VALUES (?,?,?,?,?,?,?,?,?)",
        patients
    )

    today = date.today().isoformat()
    appointments = [
        (1, "Dr. Venkat",   "Cardiology",    today, "09:00", "Consultation", "Confirmed"),
        (2, "Dr. Sunita",   "Orthopaedics",  today, "09:30", "Follow-up",    "Pending"),
        (3, "Dr. Krishnan", "Neurology",     today, "10:15", "Emergency",    "Urgent"),
        (4, "Dr. Venkat",   "Cardiology",    today, "11:00", "Review",       "Confirmed"),
        (5, "Dr. Shalini",  "Paediatrics",   today, "11:45", "Check-up",     "Confirmed"),
        (6, "Dr. Preethi",  "Oncology",      today, "14:00", "Chemo session","Scheduled"),
    ]
    c.executemany(
        "INSERT INTO appointments (patient_id,doctor,department,appt_date,appt_time,type,status) VALUES (?,?,?,?,?,?,?)",
        appointments
    )

    bills = [
        (1, "INV-1001", "Consultation",  8400,  8400,  "Paid"),
        (2, "INV-1002", "Procedures",   22000,     0,  "Pending"),
        (6, "INV-1003", "Procedures",   45500, 45500,  "Paid"),
        (3, "INV-1004", "Lab",          12800,     0,  "Overdue"),
        (5, "INV-1005", "Consultation",  3200,  3200,  "Paid"),
        (4, "INV-1006", "Pharmacy",      5600,     0,  "Pending"),
    ]
    c.executemany(
        "INSERT INTO billing (patient_id,invoice_no,category,amount,paid,status) VALUES (?,?,?,?,?,?)",
        bills
    )

    stock = [
        ("Paracetamol 500mg",   "Pharmacy",    820, "Strips", 200, 2.5,  "MedPharma"),
        ("Surgical gloves (L)", "Consumables", 110, "Pairs",  500, 12,   "SafeGlove Co"),
        ("IV Cannula 20G",      "Consumables", 300, "Units",  100, 18,   "MediPlast"),
        ("Metformin 500mg",     "Pharmacy",     40, "Tablets",500, 1.8,  "GreenPharma"),
        ("Syringe 5ml",         "Consumables", 740, "Units",  200, 3,    "MediPlast"),
        ("Oxygen cylinder",     "Equipment",     6, "Units",   10, 1200, "OxyCare"),
        ("Bandage roll",        "Consumables", 200, "Rolls",   50, 25,   "SafeGlove Co"),
        ("Gloves sterile (M)",  "Consumables",  80, "Pairs",  300, 15,   "SafeGlove Co"),
    ]
    c.executemany(
        "INSERT INTO inventory (item_name,category,quantity,unit,reorder_level,unit_price,supplier) VALUES (?,?,?,?,?,?,?)",
        stock
    )


# ─────────────────────────────────────────────
# HELPER
# ─────────────────────────────────────────────

def stock_status(qty, reorder):
    """Return a human-readable stock status."""
    if qty == 0:
        return "Out of stock"
    if qty <= reorder * 0.5:
        return "Critical"
    if qty <= reorder:
        return "Low"
    return "OK"


# ─────────────────────────────────────────────
# DASHBOARD
# ─────────────────────────────────────────────

@app.route("/")
def dashboard():
    conn = get_db()
    total_patients    = conn.execute("SELECT COUNT(*) FROM patients").fetchone()[0]
    today             = date.today().isoformat()
    todays_appts      = conn.execute("SELECT COUNT(*) FROM appointments WHERE appt_date=?", (today,)).fetchone()[0]
    pending_appts     = conn.execute("SELECT COUNT(*) FROM appointments WHERE appt_date=? AND status='Pending'", (today,)).fetchone()[0]
    total_billed      = conn.execute("SELECT COALESCE(SUM(amount),0) FROM billing").fetchone()[0]
    total_collected   = conn.execute("SELECT COALESCE(SUM(paid),0)   FROM billing").fetchone()[0]
    low_stock         = conn.execute("SELECT COUNT(*) FROM inventory WHERE quantity <= reorder_level").fetchone()[0]

    dept_counts = conn.execute(
        "SELECT department, COUNT(*) as cnt FROM patients GROUP BY department ORDER BY cnt DESC"
    ).fetchall()

    recent_appts = conn.execute("""
        SELECT a.*, p.name as patient_name
        FROM appointments a JOIN patients p ON a.patient_id=p.id
        WHERE a.appt_date=? ORDER BY a.appt_time LIMIT 6
    """, (today,)).fetchall()

    conn.close()
    return render_template("dashboard.html",
        total_patients=total_patients,
        todays_appts=todays_appts,
        pending_appts=pending_appts,
        total_billed=total_billed,
        total_collected=total_collected,
        low_stock=low_stock,
        dept_counts=dept_counts,
        recent_appts=recent_appts,
        today=today,
    )


# ─────────────────────────────────────────────
# PATIENTS
# ─────────────────────────────────────────────

@app.route("/patients")
def patients():
    search = request.args.get("q", "").strip()
    dept   = request.args.get("dept", "")
    conn   = get_db()

    query  = "SELECT * FROM patients WHERE 1=1"
    params = []
    if search:
        query  += " AND (name LIKE ? OR phone LIKE ?)"
        params += [f"%{search}%", f"%{search}%"]
    if dept:
        query  += " AND department=?"
        params.append(dept)
    query += " ORDER BY id DESC"

    all_patients = conn.execute(query, params).fetchall()
    departments  = [r[0] for r in conn.execute("SELECT DISTINCT department FROM patients ORDER BY department").fetchall()]
    conn.close()
    return render_template("patients.html", patients=all_patients, departments=departments, search=search, dept=dept)


@app.route("/patients/new", methods=["GET", "POST"])
def new_patient():
    if request.method == "POST":
        conn = get_db()
        conn.execute("""
            INSERT INTO patients (name,age,gender,phone,email,address,department,blood_group,status)
            VALUES (?,?,?,?,?,?,?,?,?)
        """, (
            request.form["name"], request.form["age"], request.form["gender"],
            request.form["phone"], request.form["email"], request.form["address"],
            request.form["department"], request.form["blood_group"], request.form["status"]
        ))
        conn.commit()
        conn.close()
        flash("Patient registered successfully!", "success")
        return redirect(url_for("patients"))
    return render_template("patient_form.html", patient=None)


@app.route("/patients/<int:pid>/edit", methods=["GET", "POST"])
def edit_patient(pid):
    conn = get_db()
    if request.method == "POST":
        conn.execute("""
            UPDATE patients SET name=?,age=?,gender=?,phone=?,email=?,address=?,department=?,blood_group=?,status=?
            WHERE id=?
        """, (
            request.form["name"], request.form["age"], request.form["gender"],
            request.form["phone"], request.form["email"], request.form["address"],
            request.form["department"], request.form["blood_group"], request.form["status"], pid
        ))
        conn.commit()
        conn.close()
        flash("Patient record updated!", "success")
        return redirect(url_for("patients"))
    patient = conn.execute("SELECT * FROM patients WHERE id=?", (pid,)).fetchone()
    conn.close()
    return render_template("patient_form.html", patient=patient)


@app.route("/patients/<int:pid>/delete", methods=["POST"])
def delete_patient(pid):
    conn = get_db()
    conn.execute("DELETE FROM patients WHERE id=?", (pid,))
    conn.commit()
    conn.close()
    flash("Patient record deleted.", "info")
    return redirect(url_for("patients"))


# ─────────────────────────────────────────────
# APPOINTMENTS
# ─────────────────────────────────────────────

@app.route("/appointments")
def appointments():
    filter_date = request.args.get("date", date.today().isoformat())
    conn = get_db()
    appts = conn.execute("""
        SELECT a.*, p.name as patient_name
        FROM appointments a JOIN patients p ON a.patient_id=p.id
        WHERE a.appt_date=? ORDER BY a.appt_time
    """, (filter_date,)).fetchall()
    patient_list = conn.execute("SELECT id, name FROM patients ORDER BY name").fetchall()
    conn.close()
    return render_template("appointments.html", appointments=appts, filter_date=filter_date, patients=patient_list)


@app.route("/appointments/new", methods=["GET", "POST"])
def new_appointment():
    conn = get_db()
    if request.method == "POST":
        conn.execute("""
            INSERT INTO appointments (patient_id,doctor,department,appt_date,appt_time,type,status,notes)
            VALUES (?,?,?,?,?,?,?,?)
        """, (
            request.form["patient_id"], request.form["doctor"], request.form["department"],
            request.form["appt_date"], request.form["appt_time"],
            request.form["type"], request.form["status"], request.form.get("notes", "")
        ))
        conn.commit()
        conn.close()
        flash("Appointment scheduled!", "success")
        return redirect(url_for("appointments"))
    patients = conn.execute("SELECT id, name FROM patients ORDER BY name").fetchall()
    conn.close()
    return render_template("appointment_form.html", appointment=None, patients=patients)


@app.route("/appointments/<int:aid>/edit", methods=["GET", "POST"])
def edit_appointment(aid):
    conn = get_db()
    if request.method == "POST":
        conn.execute("""
            UPDATE appointments SET patient_id=?,doctor=?,department=?,appt_date=?,appt_time=?,type=?,status=?,notes=?
            WHERE id=?
        """, (
            request.form["patient_id"], request.form["doctor"], request.form["department"],
            request.form["appt_date"], request.form["appt_time"],
            request.form["type"], request.form["status"], request.form.get("notes",""), aid
        ))
        conn.commit()
        conn.close()
        flash("Appointment updated!", "success")
        return redirect(url_for("appointments"))
    appt     = conn.execute("SELECT * FROM appointments WHERE id=?", (aid,)).fetchone()
    patients = conn.execute("SELECT id, name FROM patients ORDER BY name").fetchall()
    conn.close()
    return render_template("appointment_form.html", appointment=appt, patients=patients)


@app.route("/appointments/<int:aid>/delete", methods=["POST"])
def delete_appointment(aid):
    conn = get_db()
    conn.execute("DELETE FROM appointments WHERE id=?", (aid,))
    conn.commit()
    conn.close()
    flash("Appointment removed.", "info")
    return redirect(url_for("appointments"))


# ─────────────────────────────────────────────
# BILLING
# ─────────────────────────────────────────────

@app.route("/billing")
def billing():
    conn = get_db()
    bills = conn.execute("""
        SELECT b.*, p.name as patient_name
        FROM billing b JOIN patients p ON b.patient_id=p.id
        ORDER BY b.id DESC
    """).fetchall()
    total_billed    = conn.execute("SELECT COALESCE(SUM(amount),0) FROM billing").fetchone()[0]
    total_collected = conn.execute("SELECT COALESCE(SUM(paid),0)   FROM billing").fetchone()[0]
    outstanding     = total_billed - total_collected
    overdue_count   = conn.execute("SELECT COUNT(*) FROM billing WHERE status='Overdue'").fetchone()[0]
    conn.close()
    return render_template("billing.html", bills=bills,
        total_billed=total_billed, total_collected=total_collected,
        outstanding=outstanding, overdue_count=overdue_count)


@app.route("/billing/new", methods=["GET", "POST"])
def new_bill():
    conn = get_db()
    if request.method == "POST":
        last_id = conn.execute("SELECT MAX(id) FROM billing").fetchone()[0] or 0
        inv_no  = f"INV-{last_id + 1:04d}"
        amount  = float(request.form["amount"])
        paid    = float(request.form.get("paid", 0))
        if paid >= amount:
            status = "Paid"
        elif paid > 0:
            status = "Partial"
        else:
            status = "Pending"
        conn.execute("""
            INSERT INTO billing (patient_id,invoice_no,category,amount,paid,status,notes)
            VALUES (?,?,?,?,?,?,?)
        """, (
            request.form["patient_id"], inv_no, request.form["category"],
            amount, paid, status, request.form.get("notes","")
        ))
        conn.commit()
        conn.close()
        flash(f"Invoice {inv_no} created!", "success")
        return redirect(url_for("billing"))
    patients = conn.execute("SELECT id, name FROM patients ORDER BY name").fetchall()
    conn.close()
    return render_template("bill_form.html", bill=None, patients=patients)


@app.route("/billing/<int:bid>/edit", methods=["GET", "POST"])
def edit_bill(bid):
    conn = get_db()
    if request.method == "POST":
        amount = float(request.form["amount"])
        paid   = float(request.form.get("paid", 0))
        if paid >= amount:
            status = "Paid"
        elif paid > 0:
            status = "Partial"
        else:
            status = request.form.get("status", "Pending")
        conn.execute("""
            UPDATE billing SET patient_id=?,category=?,amount=?,paid=?,status=?,notes=?
            WHERE id=?
        """, (
            request.form["patient_id"], request.form["category"],
            amount, paid, status, request.form.get("notes",""), bid
        ))
        conn.commit()
        conn.close()
        flash("Invoice updated!", "success")
        return redirect(url_for("billing"))
    bill     = conn.execute("SELECT * FROM billing WHERE id=?", (bid,)).fetchone()
    patients = conn.execute("SELECT id, name FROM patients ORDER BY name").fetchall()
    conn.close()
    return render_template("bill_form.html", bill=bill, patients=patients)


@app.route("/billing/<int:bid>/delete", methods=["POST"])
def delete_bill(bid):
    conn = get_db()
    conn.execute("DELETE FROM billing WHERE id=?", (bid,))
    conn.commit()
    conn.close()
    flash("Invoice deleted.", "info")
    return redirect(url_for("billing"))


# ─────────────────────────────────────────────
# INVENTORY
# ─────────────────────────────────────────────

@app.route("/inventory")
def inventory():
    conn  = get_db()
    items = conn.execute("SELECT * FROM inventory ORDER BY category, item_name").fetchall()
    # Attach a computed status to each row
    items_with_status = []
    for item in items:
        d = dict(item)
        d["stock_status"] = stock_status(d["quantity"], d["reorder_level"])
        items_with_status.append(d)
    low_count  = sum(1 for i in items_with_status if i["stock_status"] in ("Low", "Critical", "Out of stock"))
    conn.close()
    return render_template("inventory.html", items=items_with_status, low_count=low_count)


@app.route("/inventory/new", methods=["GET", "POST"])
def new_inventory():
    if request.method == "POST":
        conn = get_db()
        conn.execute("""
            INSERT INTO inventory (item_name,category,quantity,unit,reorder_level,unit_price,supplier)
            VALUES (?,?,?,?,?,?,?)
        """, (
            request.form["item_name"], request.form["category"],
            int(request.form["quantity"]), request.form["unit"],
            int(request.form["reorder_level"]), float(request.form.get("unit_price",0)),
            request.form.get("supplier","")
        ))
        conn.commit()
        conn.close()
        flash("Item added to inventory!", "success")
        return redirect(url_for("inventory"))
    return render_template("inventory_form.html", item=None)


@app.route("/inventory/<int:iid>/edit", methods=["GET", "POST"])
def edit_inventory(iid):
    conn = get_db()
    if request.method == "POST":
        conn.execute("""
            UPDATE inventory SET item_name=?,category=?,quantity=?,unit=?,reorder_level=?,unit_price=?,supplier=?,updated_at=date('now')
            WHERE id=?
        """, (
            request.form["item_name"], request.form["category"],
            int(request.form["quantity"]), request.form["unit"],
            int(request.form["reorder_level"]), float(request.form.get("unit_price",0)),
            request.form.get("supplier",""), iid
        ))
        conn.commit()
        conn.close()
        flash("Inventory updated!", "success")
        return redirect(url_for("inventory"))
    item = conn.execute("SELECT * FROM inventory WHERE id=?", (iid,)).fetchone()
    conn.close()
    return render_template("inventory_form.html", item=item)


@app.route("/inventory/<int:iid>/delete", methods=["POST"])
def delete_inventory(iid):
    conn = get_db()
    conn.execute("DELETE FROM inventory WHERE id=?", (iid,))
    conn.commit()
    conn.close()
    flash("Item removed from inventory.", "info")
    return redirect(url_for("inventory"))


# ─────────────────────────────────────────────
# START
# ─────────────────────────────────────────────

if __name__ == "__main__":
    init_db()
    print("\n✅ HMS is running →  http://localhost:5000\n")
    app.run(debug=True, port=5000)
