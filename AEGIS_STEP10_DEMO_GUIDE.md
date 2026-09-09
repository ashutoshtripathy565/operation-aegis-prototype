# AEGIS — HACKATHON DEMONSTRATION GUIDE (STEP 10)

This guide provides a structured, deterministic path for a live 3–5 minute presentation to judges.

## Core Message for Judges
**"Aegis recommends. A human decides."**
Emphasize that AEGIS does not diagnose. It identifies early changes against a soldier's *personal baseline* to flag when a human medical review is necessary, preventing long-term physical or psychological injury while maintaining unit readiness.

---

## The 3-Minute Golden Path

### 1. The Context (Home Screen & Login)
- **Click:** Quick Login > Demo Soldier 1 (Deteriorating) `S001`
- **Talk Track:** "Meet Demo Soldier 1. They are experiencing early signs of operational stress. AEGIS allows them to voluntarily track their wellbeing securely."

### 2. Soldier Check-In (Personnel Dashboard)
- **Click:** "Wellness Check-in" tab.
- **Action:** Move the sliders (e.g., lower sleep, higher stress) and click "Submit Securely".
- **Talk Track:** "The soldier submits their data. Notice the privacy disclaimer: this data is compared only against their *own historical baseline*, not an arbitrary military standard. AEGIS does not diagnose."
- **Observe:** The "Predictive Wellness & Resilience Analysis" updates immediately, shifting the trend to "Deteriorating".

### 3. Medical Review (Medical Dashboard)
- **Click:** "Secure Log Out", then Quick Login > Medical Officer.
- **Click:** "Medical Review Register" tab.
- **Action:** Select "Demo Soldier 1" from the left list.
- **Talk Track:** "The Medical Officer sees that AEGIS has flagged a multi-domain convergence of poor sleep and high stress. The 'Aegis Intelligence Finding' recommends a human review. The MO can look at the raw data and decide on the next step."
- **Action:** Type "Recommend temporary light duty" in clinical notes and click "Restrict to Light Duty (LE)".

### 4. Commander Privacy Boundary (Commander Dashboard)
- **Click:** "Secure Log Out", then Quick Login > Commander.
- **Talk Track:** "Finally, the Unit Commander logs in. Notice the privacy banner. The Commander does *not* see the soldier's raw check-in answers, cognitive scores, or the doctor's clinical notes."
- **Observe:** The aggregate counters (e.g., "Welfare Review") reflect the overall health of the unit. The Commander can see operational availability but not the underlying medical privacy details.

### 5. Reset for Next Judge (Admin Dashboard)
- **Click:** "Secure Log Out", then Quick Login > System Admin.
- **Click:** "RESET SYNTHETIC DEMO DATA" at the bottom of the sidebar.
- **Talk Track:** "After the demo, all synthetic data can be reset."

---

## Handling Questions / Edge Cases

- **"Is it a real medical device?"** -> Point to the global yellow banner: "SYNTHETIC DEMO ENVIRONMENT — NOT FOR CLINICAL USE".
- **"What if the soldier lies?"** -> The system correlates self-reported data with wearable telemetry (Health Connect) and cognitive tests (reaction time) to detect multi-domain anomalies. 
- **"How is Commander bias prevented?"** -> Point to the Privacy boundary on the Commander Dashboard. Commanders only see "Available / Under Observation" and aggregate unit trends, never raw psychological data.
