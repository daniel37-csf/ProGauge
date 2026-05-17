# Security Specification - Pro/Gauge Terminal

## 1. Data Invariants
- A user document must have an email matching their auth token.
- A user's username must be unique (guaranteed by the `usernames` collection mapping).
- Administrative access is strictly controlled via the `admins` collection.
- Timestamps must be server-generated.

## 2. Dirty Dozen Payloads

### Identity Spoofing
1. `CREATE /users/hacker_id { email: 'victim@gmail.com', ... }` (UID mismatch)
2. `UPDATE /users/victim_id { email: 'hacker@gmail.com' }` (Changing another user's email)
3. `CREATE /admins/hacker_id { role: 'root' }` (Self-elevation to admin)

### Integrity / Value Poisoning
4. `CREATE /users/my_id { email: 'not-an-email', username: 'a', ... }` (Invalid format/size)
5. `CREATE /users/my_id { username: 'A_VERY_LONG_USERNAME_EXCEEDING_LIMITS_...', ... }` (Size poisoning)
6. `UPDATE /users/my_id { createdAt: timestamp_in_past }` (Immutable field violation)
7. `CREATE /users/my_id { ... updatedAt: '2020-01-01' }` (Client-side timestamp fraud)

### Relation / Atomicity
8. `CREATE /users/my_id { ... }` without creating `/usernames/my_alias` (Orphaned username)
9. `CREATE /usernames/taken_alias { userId: 'my_id' }` (Username theft if already exists)

### Resource / DOS
10. `GET /users/some_very_long_junk_id_to_exhaust_cycles` (Path variable poisoning)
11. `LIST /users` (Blanket read attempt)
12. `CREATE /users/my_id` with 1MB of shadow properties (Schema violation)

## 3. Test Runner (Draft)
The tests will verify that all above payloads result in `PERMISSION_DENIED`.
