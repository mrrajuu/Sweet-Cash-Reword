# Sweet Cash Rewards - Security Specification & Threat Model

## 1. Data Invariants

1. **Balance Immutability by Users**: A user MUST NEVER be able to directly modify their `balance`, `pendingBalance`, or `totalEarned` via client Firestore operations. All financial increments and decrements MUST happen through server-side validated API calls (`/api/claim-daily-bonus`, `/api/postback/offerwall`, `/api/withdraw`).
2. **Role Escalation Protection**: Regular users cannot elevate their role to `admin` or modify their `role` field.
3. **Identity Verification**: Every read and write to user-owned documents (`users/{userId}`, `transactions/{id}`, `withdrawals/{id}`) must ensure `resource.data.userId == request.auth.uid` unless the requester is an authorized administrator.
4. **No Blanket List Queries**: All queries must enforce relational scoping (`where('userId', '==', auth.uid)`) to avoid bulk record extraction.
5. **Withdrawal State Machine**: A user can only create a withdrawal request if authenticated. Once a withdrawal is created, only administrators can modify its status to `approved`, `rejected`, or `processing`. Users cannot alter `status`, `txHash`, or `amount`.
6. **Offer Catalog Protection**: Regular users have read-only access to active offers. Only administrators can create, update, or delete offers.
7. **Postback Integrity**: Postback logs can only be written by the secure server backend and read by admins.
8. **Admin Bootstrapping**: Authorized admin includes `mdfarukhossain8573@gmail.com` or any UID present in `/admins/{adminId}`.

---

## 2. The "Dirty Dozen" Threat Payloads

1. **Payload 1: Direct Balance Elevation Attack**
   - *Target*: `PATCH /users/{uid}`
   - *Payload*: `{"balance": 999999.00}`
   - *Expected Result*: PERMISSION_DENIED. Users cannot write to their balance.

2. **Payload 2: Role Escalation Attack**
   - *Target*: `PATCH /users/{uid}`
   - *Payload*: `{"role": "admin"}`
   - *Expected Result*: PERMISSION_DENIED.

3. **Payload 3: Cross-User Balance Snooping**
   - *Target*: `GET /users/{another_uid}`
   - *Payload*: Query for victim's document
   - *Expected Result*: PERMISSION_DENIED. Only document owner or admin can read.

4. **Payload 4: Fake Completed Offer Injection**
   - *Target*: `POST /transactions`
   - *Payload*: `{"userId": "victim_uid", "type": "offer", "amount": 500, "status": "completed"}`
   - *Expected Result*: PERMISSION_DENIED. Direct client transaction creation with completed status is blocked.

5. **Payload 5: Self-Approval of Withdrawal**
   - *Target*: `PATCH /withdrawals/{withdrawalId}`
   - *Payload*: `{"status": "approved", "txHash": "0xFAKE12345"}`
   - *Expected Result*: PERMISSION_DENIED. Only administrators can update withdrawals.

6. **Payload 6: Withdrawal Fee Forgery**
   - *Target*: `POST /withdrawals`
   - *Payload*: `{"userId": "my_uid", "amount": 100, "fee": -50, "netAmount": 150}`
   - *Expected Result*: PERMISSION_DENIED.

7. **Payload 7: Postback Audit Tampering**
   - *Target*: `DELETE /postback_logs/{logId}`
   - *Payload*: Deletion request from regular user
   - *Expected Result*: PERMISSION_DENIED.

8. **Payload 8: Global Settings Manipulation**
   - *Target*: `PATCH /settings/global`
   - *Payload*: `{"minWithdrawalUsdt": 0.0001, "dailyBonusBase": 1000}`
   - *Expected Result*: PERMISSION_DENIED.

9. **Payload 9: Public Offer Forgery / Price Tampering**
   - *Target*: `POST /offers`
   - *Payload*: `{"title": "Free 1000 USDT", "rewardAmount": 1000, "status": "active"}`
   - *Expected Result*: PERMISSION_DENIED.

10. **Payload 10: ID Poisoning / Buffer Overflow Attack**
    - *Target*: `GET /users/a_very_long_string_with_illegal_characters_$$$###___1234`
    - *Payload*: Invalid document ID
    - *Expected Result*: PERMISSION_DENIED / validation rejection via `isValidId()`.

11. **Payload 11: Unauthenticated Database Scraping**
    - *Target*: `GET /transactions`
    - *Payload*: Unauthenticated query
    - *Expected Result*: PERMISSION_DENIED.

12. **Payload 12: Admin List Injection**
    - *Target*: `POST /admins/{my_uid}`
    - *Payload*: `{"uid": "my_uid", "email": "hacker@evil.com", "role": "super_admin"}`
    - *Expected Result*: PERMISSION_DENIED. Only existing verified admin can create admin documents.

---

## 3. Test Runner Design

The test runner validates that each of the 12 malicious payloads fails with a permission denied error when simulated against the security rules, verifying that neither client manipulation nor state shortcutting can succeed.
