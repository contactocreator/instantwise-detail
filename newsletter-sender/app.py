import csv
import hashlib
import hmac
import io
import os
import smtplib
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

import requests as http
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

load_dotenv()

app = Flask(__name__)

BASE_DIR = Path(__file__).parent
UNSUBSCRIBED_FILE = BASE_DIR / "unsubscribed.csv"

# ── Secret key (generated once, stored locally) ──────────────────────────────
_SECRET_FILE = BASE_DIR / ".secret_key"
if _SECRET_FILE.exists():
    SECRET_KEY = _SECRET_FILE.read_text().strip().encode()
else:
    import secrets
    _key = secrets.token_hex(32)
    _SECRET_FILE.write_text(_key)
    SECRET_KEY = _key.encode()


# ── Helpers ───────────────────────────────────────────────────────────────────

def make_token(email: str) -> str:
    return hmac.new(SECRET_KEY, email.lower().encode(), hashlib.sha256).hexdigest()[:24]


def get_unsubscribed() -> set[str]:
    if not UNSUBSCRIBED_FILE.exists():
        return set()
    with open(UNSUBSCRIBED_FILE, newline="", encoding="utf-8") as f:
        return {row["email"].strip().lower() for row in csv.DictReader(f) if row.get("email")}


def add_unsubscribed(email: str) -> None:
    email = email.strip().lower()
    existing = get_unsubscribed()
    if email in existing:
        return
    write_header = not UNSUBSCRIBED_FILE.exists()
    with open(UNSUBSCRIBED_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if write_header:
            writer.writerow(["email"])
        writer.writerow([email])


def remove_unsubscribed(email: str) -> None:
    email = email.strip().lower()
    existing = get_unsubscribed()
    if email not in existing:
        return
    remaining = existing - {email}
    with open(UNSUBSCRIBED_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["email"])
        for e in sorted(remaining):
            writer.writerow([e])


def parse_emails_from_csv(file_content: str) -> list[str]:
    reader = csv.DictReader(io.StringIO(file_content))
    emails = []
    if reader.fieldnames:
        email_col = next(
            (f for f in reader.fieldnames if f.strip().lower() in ("email", "이메일", "mail", "e-mail")),
            reader.fieldnames[0],
        )
        for row in reader:
            val = row.get(email_col, "").strip()
            if val and "@" in val:
                emails.append(val)
    else:
        for line in file_content.splitlines():
            val = line.strip()
            if val and "@" in val:
                emails.append(val)
    return emails


def build_unsubscribe_footer(email: str, server_url: str) -> str:
    token = make_token(email)
    import urllib.parse
    link = f"{server_url}/unsubscribe?email={urllib.parse.quote(email)}&token={token}"
    return f"""
<div style="margin-top:32px; padding-top:16px; border-top:1px solid #d1d5db; text-align:center; font-size:11px; color:#888; font-family:sans-serif;">
  더 이상 뉴스레터를 받고 싶지 않으신가요?&nbsp;
  <a href="{link}" style="color:#888; text-decoration:underline;">수신거부</a>
</div>"""


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template(
        "index.html",
        saved_gmail=os.getenv("GMAIL", ""),
        saved_password=os.getenv("GMAIL_APP_PASSWORD", ""),
    )


@app.route("/preview", methods=["POST"])
def preview():
    csv_file = request.files.get("csv_file")
    html_file = request.files.get("html_file")

    if not csv_file or not html_file:
        return jsonify({"error": "CSV와 HTML 파일을 모두 업로드해주세요."}), 400

    csv_content = csv_file.read().decode("utf-8-sig")
    html_content = html_file.read().decode("utf-8")
    emails = parse_emails_from_csv(csv_content)

    if not emails:
        return jsonify({"error": "CSV에서 이메일을 찾을 수 없습니다."}), 400

    unsubscribed = get_unsubscribed()
    filtered = [e for e in emails if e.lower() not in unsubscribed]

    return jsonify({
        "emails": filtered,
        "count": len(filtered),
        "skipped": len(emails) - len(filtered),
        "html_content": html_content,
    })


@app.route("/send", methods=["POST"])
def send():
    data = request.get_json()
    gmail = (data.get("gmail") or "").strip()
    password = (data.get("password") or "").strip()
    subject = (data.get("subject") or "").strip()
    emails = data.get("emails", [])
    html_content = data.get("html_content", "")
    server_url = (data.get("server_url") or "http://localhost:5050").rstrip("/")

    if not all([gmail, password, subject, emails, html_content]):
        return jsonify({"error": "필수 항목이 누락되었습니다."}), 400

    # Final filter against unsubscribe list
    unsubscribed = get_unsubscribed()
    emails = [e for e in emails if e.lower() not in unsubscribed]

    results = []
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(gmail, password)
    except smtplib.SMTPAuthenticationError:
        return jsonify({"error": "Gmail 인증 실패. 앱 비밀번호를 확인해주세요."}), 401
    except Exception as e:
        return jsonify({"error": f"Gmail 연결 실패: {e}"}), 500

    for email in emails:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = gmail
            msg["To"] = email

            token = make_token(email)
            import urllib.parse
            unsub_url = f"{server_url}/unsubscribe?email={urllib.parse.quote(email)}&token={token}"
            msg["List-Unsubscribe"] = f"<{unsub_url}>"
            msg["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"

            footer = build_unsubscribe_footer(email, server_url)
            full_html = html_content.replace("</body>", f"{footer}</body>")
            if "</body>" not in html_content:
                full_html = html_content + footer

            msg.attach(MIMEText(full_html, "html", "utf-8"))
            server.sendmail(gmail, email, msg.as_string())
            results.append({"email": email, "status": "success"})
        except Exception as e:
            results.append({"email": email, "status": "error", "error": str(e)})
        time.sleep(0.3)

    server.quit()
    return jsonify({"results": results})


@app.route("/unsubscribe", methods=["GET"])
def unsubscribe():
    email = request.args.get("email", "").strip()
    token = request.args.get("token", "").strip()

    if not email or not token:
        return render_template("unsubscribed.html", success=False, message="잘못된 요청입니다.")

    expected = make_token(email)
    if not hmac.compare_digest(token, expected):
        return render_template("unsubscribed.html", success=False, message="유효하지 않은 링크입니다.")

    add_unsubscribed(email)
    return render_template("unsubscribed.html", success=True, email=email, message="")


@app.route("/unsubscribe-list", methods=["GET"])
def unsubscribe_list():
    return jsonify({"emails": sorted(get_unsubscribed())})


@app.route("/unsubscribe-add", methods=["POST"])
def unsubscribe_add():
    email = (request.get_json() or {}).get("email", "").strip()
    if not email or "@" not in email:
        return jsonify({"error": "유효한 이메일을 입력해주세요."}), 400
    add_unsubscribed(email)
    return jsonify({"ok": True, "emails": sorted(get_unsubscribed())})


@app.route("/unsubscribe-remove", methods=["POST"])
def unsubscribe_remove():
    email = (request.get_json() or {}).get("email", "").strip()
    if not email:
        return jsonify({"error": "이메일을 입력해주세요."}), 400
    remove_unsubscribed(email)
    return jsonify({"ok": True, "emails": sorted(get_unsubscribed())})


# ── Admin API proxy ───────────────────────────────────────────────────────────

@app.route("/admin-login", methods=["POST"])
def admin_login():
    data = request.get_json()
    api_url = (data.get("api_url") or "").rstrip("/")
    email = (data.get("email") or "").strip()
    password = (data.get("password") or "").strip()

    if not all([api_url, email, password]):
        return jsonify({"error": "API URL, 이메일, 비밀번호를 입력해주세요."}), 400

    try:
        res = http.post(
            f"{api_url}/api/v1/users/signin",
            json={"email": email, "password": password},
            timeout=10,
        )
    except Exception as e:
        return jsonify({"error": f"서버 연결 실패: {e}"}), 500

    if not res.ok:
        return jsonify({"error": "로그인 실패. 이메일/비밀번호를 확인해주세요."}), 401

    body = res.json()
    return jsonify({"token": body.get("accessToken"), "userId": body.get("userId")})


@app.route("/admin-emails", methods=["POST"])
def admin_emails():
    data = request.get_json()
    api_url = (data.get("api_url") or "").rstrip("/")
    token = (data.get("token") or "").strip()

    if not api_url or not token:
        return jsonify({"error": "API URL과 토큰이 필요합니다."}), 400

    try:
        res = http.get(
            f"{api_url}/api/v1/users/export/name?name=",
            headers={"Authorization": token},
            timeout=15,
        )
    except Exception as e:
        return jsonify({"error": f"유저 목록 조회 실패: {e}"}), 500

    if res.status_code == 401:
        return jsonify({"error": "인증이 만료됐습니다. 다시 로그인해주세요."}), 401
    if not res.ok:
        return jsonify({"error": f"API 오류: {res.status_code}"}), 500

    users = res.json()
    emails = [u.get("email") for u in users if u.get("email")]
    unsubscribed = get_unsubscribed()
    filtered = [e for e in emails if e.lower() not in unsubscribed]

    return jsonify({
        "emails": filtered,
        "count": len(filtered),
        "skipped": len(emails) - len(filtered),
        "total": len(emails),
    })


if __name__ == "__main__":
    app.run(debug=True, port=5050)
