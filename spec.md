# TRUPTAR Bank – Profile Page Cleanup & Security Enhancement

## Current State
The Profile page (`/profile`) has 9 sections with hardcoded example data pre-filled (e.g. "John Doe", "johndoe88", example account numbers, sample activity logs, mock documents). Email Verification section simulates a code send but does not actually email a code. The Authenticator App 2FA section shows a static setup without generating a real TOTP secret key.

## Requested Changes (Diff)

### Add
- TOTP secret key generation for Authenticator App 2FA: generate a Base32 secret, display as QR code (otpauth URI) and manual entry key, with a 6-digit code confirm step
- Email verification flow: simulate sending a code to the entered email address with a realistic UX (spinner → "Code sent to your@email.com" confirmation → 6-digit input → verify)
- "Code sent" confirmation message showing which email the code was sent to

### Modify
- Profile Overview: remove all pre-filled example values (name, username, account number, country, etc.) — show empty/placeholder state
- Personal Information: clear all pre-filled form values (First Name, Last Name, DOB, Gender, Country, City, Address, Postal Code)
- Username Settings: clear pre-filled username
- Contact Information: clear pre-filled email and phone
- Email Verification: improve flow to show code-sent confirmation with email address, 6-digit entry, and verify button
- KYC section: clear pre-filled values
- Security Settings – Authenticator App 2FA: generate a TOTP secret key (Base32), display a scannable QR code URI and copyable manual key, require user to enter a 6-digit code to confirm activation
- Activity Logs: remove hardcoded mock rows — show empty state by default
- Documents: already shows empty state — keep as is

### Remove
- All hardcoded example personal data (names, usernames, account numbers, phone numbers, addresses, sample log rows)

## Implementation Plan
1. Strip all default/initial state values that contain example data in ProfilePage.tsx
2. Replace activity log mock data array with an empty array
3. Update Email Verification section: after clicking "Send Verification Code", show spinner then display "Code sent to [email]" message with 6-digit input
4. Update Authenticator App 2FA: on enable click, generate a random Base32 secret, display QR code image URL (using a QR API) and the raw secret for manual entry, add confirm-code input, activate only after correct code entry (accept any 6-digit input for demo)
5. Validate and deploy
