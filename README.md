# bluebot. | the honest legal auditor

A minimalist, sequence-aware legal citation auditor designed to enforce Bluebook compliance with a focus on Dieter Rams’ design principles.

---

## 1. the vision

Legal writing is often gatekept by the mechanical complexity of the Bluebook. **bluebot** was created to bridge the gap between rigorous legal standards and modern software efficiency. By automating the "tedious but necessary," it allows the writer to focus on the substance of the law rather than the placement of a period.

## 2. core logic & architecture

### the "id." state machine

Unlike standard "find and replace" tools, **bluebot** views a document as a chronological sequence.

- **State Awareness:** The backend tracks the "Previously Cited Case" in memory.
- **Contextual Suggestion:** If Case A is cited immediately after Case A, the auditor triggers a **Sequence Alert**, suggesting the short-form "Id." instead of a redundant full citation.

### abbreviation engine (rule 10.2.1)

The auditor utilizes a SQLite-backed relational database containing thousands of entries from Bluebook Tables T6 (Institutional Abbreviations) and T10 (Geographical Terms).

- **Regex Extraction:** Citations are identified using a custom regular expression pattern that isolates party names from reporter data.
- **Index Precision:** The editor uses a layered DOM approach, where a visual "highlight layer" is perfectly synced with an interactive "textarea layer" to ensure non-destructive editing.

## 3. design philosophy: "less, but better"

Inspired by Dieter Rams, the UI was designed to be:

- **Unobtrusive:** A soft powder-blue palette and ample white space minimize cognitive load.
- **Honest:** The tool clearly distinguishes between mechanical "Fixes" (abbreviations) and stylistic "Alerts" (sequence issues).
- **Thorough:** Every detail—from the 24px corner radii to the "Copied!" clipboard feedback—is intentional.

## 4. analytical limitations (intellectual honesty)

In the spirit of honest design, it is important to note what this prototype does not yet cover:

- **Signals & Hierarchy:** The current version focuses on Case Names (Rule 10). It does not yet audit citation signals (Rule 1.2) or their order of authorities.
- **The "Short Form" Memory:** While the tool identifies immediate repeats (Id.), it does not yet maintain a long-term "Document Memory" for short-form citations used paragraphs later (Rule 10.9).
- **Jurisdictional Overrides:** This version is "Pure Bluebook" and does not account for local state court style manuals (e.g., The California Style Manual).

## 5. setup & installation

### backend (python/flask)

1. `cd backend`
2. `pip install -r requirements.txt`
3. `python seed.py` (to initialize the Bluebook database)
4. `python app.py`

### frontend (react/vite)

1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

**Author:** [Saimongh](https://github.com/saimongh)  
