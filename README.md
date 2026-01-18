# ⚖️ bluebot. | the honest legal auditor

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![React](https://img.shields.io/badge/react-%2320232b.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

A sequence-aware, minimalist legal citation auditor engineered to enforce Bluebook compliance through automated linguistic analysis and intentional design.

> [!TIP]
> **[🚀 TRY THE LIVE DEMO HERE](https://bluebot-1.onrender.com)**

> [!IMPORTANT]
> **Server Wake-up Notice:** This application is hosted on a free-tier server. If the application has been idle, please allow **30–60 seconds** for the initial scan to "wake up" the backend auditor. Subsequent scans will be nearly instantaneous.

---



## 🎯 1. The Vision
Legal scholarship is often encumbered by the mechanical complexity of the **Bluebook**. Precision is paramount, yet the manual process of auditing citations for Rule 10 compliance is prone to human fatigue. **bluebot** was built to bridge this gap, automating the "tedious but necessary" to allow the writer to focus on the substance of their legal argument.

---

## ⚙️ 2. Core Logic and Engineering
Unlike standard text-replacement tools, **bluebot** treats a legal document as a **state-dependent sequence**.

### 🧠 The "Id." State Machine
The backend logic distinguishes between isolated errors and sequential ones to mirror the flow of legal writing.
* **Contextual Memory:** The auditor tracks the "Previously Cited Case" across the scanning window.
* **Short-Form Logic:** If *Case A* is followed immediately by another citation to *Case A*, the tool triggers a **Sequence Alert**, suggesting the short-form ***Id.*** instead of a redundant full citation.



### 📚 Abbreviation Engine (Rule 10.2.1)
The auditor leverages a relational SQLite database mapped to **Table T6 (Institutional Abbreviations)** and **Table T10 (Geographic Terms)**.
* **Regex Extraction:** A custom regular expression isolates party names from reporter data, ensuring that abbreviations are only applied to the correct segments of the citation.
* **Non-Destructive Editing:** Using a layered DOM approach, the editor overlays visual highlights (the "visual layer") over the interactive textarea (the "functional layer"), maintaining document integrity while providing real-time feedback.

---

## 🧪 3. Proof of Concept (Testing Scenarios)
To verify the logic engine, paste the following scenarios into the auditor:

| Test Scenario | Input Text | Expected Behavior | Technical Logic |
| :--- | :--- | :--- | :--- |
| **Rule 10.2.1** | `University of California v Department of Justice` | **Action Required:** Suggests `Univ. of Cal. v. Dep't of Justice` | Identifies T6 institutional terms. |
| **Sequence Alert** | `Marbury v. Madison... Marbury v. Madison...` | **Sequence Alert:** Suggests `Id.` for the second instance | Tracks consecutive case keys. |
| **Perfect Cite** | `Microsoft Corp. v. Smith, 123 U.S. 456 (2024)` | **Passed:** No changes suggested | Validates against DB entries. |
| **Single Party** | `In the matter of Smith v. Jones` | **Passed:** No abbreviations suggested | Respects Rule 10.2.1 single-word rule. |

---

## 🛑 4. Analytical Limitations
In the spirit of honest design, this prototype acknowledges the vast complexity of legal citation:
* **Signals & Hierarchy:** Current logic audits Case Names (Rule 10) but does not yet interpret Citation Signals (Rule 1.2).
* **Long-Term Memory:** While immediate repeats are flagged as *Id.*, the tool does not yet track long-term short-form citations (Rule 10.9) over multiple pages.
* **Jurisdictional Overrides:** This version is "Pure Bluebook" and does not account for state-specific manuals like the *California Style Manual*.

---



## 🚀 5. Setup & Installation

### Backend (Python/Flask)
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python seed.py` (to build the T6/T10 database)
4. `python app.py`

### Frontend (React/Vite)
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---
**Author:** [Saimongh](https://github.com/saimongh)  
**Perspective:** Developed by a Finance graduate and 2026 Law School Applicant to solve the mechanical friction of legal writing.
