# ENERMIND — Global Digital Campus Ecosystem Architecture

## 1. Executive Summary

**Enermind** is a real, production-ready, global digital university and college platform unifying academic coursework, verified student accommodation, career opportunities, Google Sheets productivity tools, student-to-student commerce, and Google Workspace integrations into a single operating system.

---

## 2. Security & Zero-Secret Client Architecture

### 2.1 Backend-Only Credentials
All sensitive API keys and client secrets are restricted strictly to server-side environments:
- **PesaPal v3 API**: `PESAPAL_CONSUMER_KEY` and `PESAPAL_CONSUMER_SECRET` are used exclusively by `server/services/pesapal.ts`.
- **Gemini AI**: `@google/genai` is initialized server-side in `server/services/gemini.ts` using `process.env.GEMINI_API_KEY`.
- **Client Application**: The browser never receives or stores payment gateway secrets, AI keys, or admin access tokens.

### 2.2 Google Identity & Workspace OAuth
- Google Workspace tokens use client-side OAuth flow (`initTokenClient` / Google Identity Services) with least-privilege scopes:
  - `https://www.googleapis.com/auth/drive.file`
  - `https://www.googleapis.com/auth/drive.metadata.readonly`
  - `https://www.googleapis.com/auth/spreadsheets`
- **Private Vault Guarantee**: User documents stored in `Enermind/Private Vault/` remain in the student's personal Google Drive account. Files are not indexed or scraped. AI access requires explicit per-session authorization.

---

## 3. Global University Hierarchy

The directory model is structured hierarchically to support any university worldwide:
```
Country
  └── Institution (University / College / TVET)
        └── Campus
              └── College / Faculty
                    └── Department
                          └── Course / Degree Program
                                └── Academic Year / Level
```

### Unlisted Institution Proposals
When a user's institution is not yet in the approved catalog:
1. The student submits a proposal via `+ Add Institution`.
2. The proposal is registered in the database with status `PENDING`.
3. It appears immediately in the administrator moderation queue (`/api/admin/institutions/pending`).
4. Upon admin verification, the status transitions to `APPROVED` and is indexed globally.

---

## 4. Multi-Currency Engine

- **Base Currency**: USD.
- **Supported Global Currencies**: USD ($), GBP (£), EUR (€), CAD (CA$), AUD (A$), KES (KSh), NGN (₦), ZAR (R), GHS (GH₵), UGX (USh), TZS (TSh), INR (₹), AED, SGD.
- **Rule of Transparency**: Listings preserve their original price and vendor currency. Conversions are displayed with an estimate flag and rate timestamp.

---

## 5. PesaPal v3 Payment Gateway Flow

1. Order created on backend (`POST /api/orders`) with status `CREATED`.
2. Server submits order to PesaPal (`POST /api/Transactions/SubmitOrderRequest`).
3. Order tracking ID and secure payment redirect URL returned.
4. User completes payment via Card / Mobile Money.
5. PesaPal IPN Listener (`/api/pesapal/ipn-listener`) verifies status (`GET /api/Transactions/GetTransactionStatus`) and transitions order to `PAID`.
6. Audit log entry recorded with immutable timestamp.

---

## 6. Official Social & Community Channels

- **YouTube**: [https://www.youtube.com/@Enemindcompany](https://www.youtube.com/@Enemindcompany) (`@Enemindcompany`)
- **Instagram**: [https://www.instagram.com/enermindcom/](https://www.instagram.com/enermindcom/) (`@enermindcom`)
- **Facebook**: [https://facebook.com](https://facebook.com) (`Enemind Comp`)
- **TikTok**: [https://tiktok.com/@enemind](https://tiktok.com/@enemind) (`@enemind` / `Enemind`)

---

## 7. Role-Based Access Control (RBAC)

- `STUDENT`: Course resources, housing, gigs, marketplace, private vault.
- `LECTURER`: Past paper uploads, course syllabus authoring.
- `CAMPUS_MODERATOR`: Local campus accommodation and community moderation.
- `ADMIN`: Institution approval queue, dispute resolution.
- `SUPER_ADMIN`: Full platform configuration, IPN audit oversight, user role management.
