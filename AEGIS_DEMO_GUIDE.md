# OPERATION AEGIS — HACKATHON DEMO GUIDE

This guide provides a reliable, deterministic 3-5 minute demonstration script for Operation Aegis. 
The system operates entirely on a single source of truth, avoiding duplicate state or fabricated UI behaviors.

## Demo Personnel
*   **S001 (Demo Soldier 1)**: Pre-loaded with synthetic history showing a gradual decline in wellbeing (sleep deprivation, mood decline, cognitive strain). This soldier will be flagged by Aegis.
*   **S002 (Demo Soldier 2)**: Pre-loaded with stable synthetic history. Used to verify isolation (proving not every soldier is flagged).

---

## Pre-Flight Check
To ensure a clean demonstration, click **RESET DEMO DATA**:
1. Login as **Admin** (Username: `ADMIN`, Password: `any`).
2. At the bottom of the sidebar, click **RESET DEMO DATA**. 
3. This safely restores S001 and S002 to their exact baseline states and clears previous follow-up cases.

---

## The 5-Minute Demonstration Script

### Part 1: The Soldier Experience (Detection & Baselines)
1.  **Login as Soldier**
    *   Username: `S001` (or click `Soldier (Demo Bypass)`)
    *   Password: `any`
2.  **Submit a Check-in**
    *   Navigate to the **Wellbeing** tab.
    *   Submit a new check-in confirming high stress, low sleep, and poor mood.
3.  **Complete a Cognitive Assessment**
    *   Navigate to the **Cognitive Assessment** tab.
    *   Run through the rapid cognitive test (requires real interaction).
4.  **Show "My Trends"**
    *   Navigate to the **My Trends** tab.
    *   Explain how Aegis does not rank soldiers against each other. Instead, it computes a **Personal Baseline** and detects meaningful longitudinal deviations. S001 can see their own decline without alarming medical diagnoses.

### Part 2: The Medical Officer (Human-in-the-Loop Review)
5.  **Login as Medical Officer**
    *   Username: `MEDICAL`
    *   Password: `any`
6.  **Aegis Intelligence Flagging**
    *   Aegis runs autonomously in the background. Navigate to the **Aegis Follow-Up Queue** tab.
    *   You will see an active case generated for S001 because the new inputs broke personal baseline thresholds.
    *   *Note that S002 is NOT in the queue because their data remained stable.*
7.  **Review the Case**
    *   Click on the active case for S001.
    *   Show the **AEGIS INTELLIGENCE FINDING**: Aegis clearly explains *why* the soldier was flagged (e.g., multi-domain decline, persistent sleep drops) along with Data Confidence levels.
8.  **Take Action**
    *   Under the **HUMAN REVIEW WORKFLOW**, type a brief clinical note (e.g., "Noticed sleep disruption, scheduling quick sync.")
    *   Select **Schedule Follow-Up** and pick a time.
    *   *Crucial Point for Judges*: Aegis does not diagnose or restrict soldiers. It provides intelligence; the human Medical Officer decides the action.

### Part 3: The Soldier Notification (Support without Stigma)
9.  **Login as Soldier (S001) again**
    *   On the **Readiness Hub**, point out the supportive banner: *"Medical Check-in Scheduled."*
    *   *Crucial Point for Judges*: S001 sees the scheduled support, but the Medical Officer's private notes and Aegis's internal risk categories remain strictly hidden.

### Part 4: The Commander Aggregate (Operational Oversight)
10. **Login as Commander**
    *   Username: `COMMANDER`
    *   Password: `any`
11. **Unit Status**
    *   On the **Dashboard Summary**, show the **Medical Follow-Ups** metric. It reflects exactly 1 Active Case (S001).
    *   Navigate to **Section Personnel**. The Commander sees operational availability and general welfare statuses, but zero clinical data, raw psychological answers, or cognitive scores.
12. **Conclusion**
    *   This completes the data flow proving S001’s single action propagated correctly to Medical Intelligence, Soldier scheduling, and Commander unit aggregates, without data leakage or hard-coded UI fakery.

---

### Data Provenance Note for Judges
*   **Source Truth**: Any data entered during the demo explicitly carries a `source: SOLDIER` tag, distinguishing it from `source: UNIT` contextual metadata.
*   **No Duplicate State**: The UI does not fake these transitions. Every screen pulls from the same globally managed `AegisContext.jsx` history store, separated securely by Role-Based Access Control filters.
