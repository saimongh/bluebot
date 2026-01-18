# bluebot. | the honest legal auditor

A sequence-aware, minimalist legal citation auditor engineered to enforce Bluebook compliance through automated linguistic analysis and intentional design.
# try the live demo [HERE](https://bluebot-bqxy.onrender.com) 
Note: This application is hosted on a free tier. Please allow 30–60 seconds for the server to spin up on your first visit.

---

## 1. THE VISION
Legal scholarship is often encumbered by the mechanical complexity of the **Bluebook**. Precision is paramount, yet the manual process of auditing citations for Rule 10 compliance is prone to human fatigue. **bluebot** was built to bridge this gap, automating the "tedious but necessary" to allow the writer to focus on the substance of their legal argument.

## 2. Core Logic and Engineering
Unlike standard text-replacement tools, **bluebot** treats a legal document as a **state-dependent sequence**.

### the "id." state machine
The backend logic distinguishes between isolated errors and sequential ones to mirror the flow of legal writing.
* **Contextual Memory:** The auditor tracks the "Previously Cited Case" across the scanning window.
* **Short-Form Logic:** If *Case A* is followed immediately by another citation to *Case A*, the tool triggers a **Sequence Alert**, suggesting the short-form ***Id.*** instead of a redundant full citation.

### Abbreviation Engine (rule 10.2.1)
The auditor leverages a relational SQLite database mapped to **Table T6 (Institutional Abbreviations)** and **Table T10 (Geographic Terms)**.
* **Regex Extraction:** A custom regular expression isolates party names from reporter data, ensuring that abbreviations are only applied to the correct segments of the citation.
* **Non-Destructive Editing:** Using a layered DOM approach, the editor overlays visual highlights (the "visual layer") over the interactive textarea (the "functional layer"), maintaining document integrity while providing real-time feedback.

## 3. Analytical Limitations (Intellectual Honesty)
In the spirit of honest design, this prototype acknowledges the vast complexity of legal citation:
* **Authoritative Signals:** Current logic audits Case Names (Rule 10) but does not yet interpret Citation Signals (Rule 1.2).
* **Long-Term Memory:** While immediate repeats are flagged as *Id.*, the tool does not yet track long-term short-form citations (Rule 10.9) over multiple pages.
* **Jurisdictional Overrides:** This version is "Pure Bluebook" and does not account for state-specific manuals like the *California Style Manual*.

## 4. HOW TO TEST (proof of concept)
To verify the logic engine, paste the following scenarios into the auditor:

| test scenario | input text | expected behavior | logic |
| :--- | :--- | :--- | :--- |
| **rule 10.2.1** | `University of California v Department of Justice` | **Action Required:** Suggests `Univ. of Cal. v. Dep't of Justice` | Identifies T6 institutional terms. |
| **sequence alert** | `Marbury v. Madison... Marbury v. Madison...` | **Sequence Alert:** Suggests `Id.` for the second instance | Tracks consecutive case keys. |
| **perfect cite** | `Microsoft Corp. v. Smith, 123 U.S. 456 (2024)` | **Passed:** Recognizes existing abbreviations | Validates against DB entries. |
| **single party** | `In the matter of Smith v. Jones` | **Passed:** No abbreviations suggested | Respects Rule 10.2.1 single-word rule. |



## 6. setup & installation

### backend (python/flask)
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python seed.py` (to build the T6/T10 database)
4. `python app.py`

### frontend (react/vite)
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---
**Author:** [Saimongh](https://github.com/saimongh)  
**Perspective:** Developed by a Finance graduate and 2026 Law School Applicant to solve the mechanical friction of legal writing.
