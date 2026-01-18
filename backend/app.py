from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import re
import os

app = Flask(__name__)
CORS(app)

# Dynamically finds the database on your Mac or the Render server
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'bluebook.db')

def abbreviate_string(text):
    """The engine that lookups terms in your T6/T10 database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    words = text.split()
    corrected_words = []
    
    for word in words:
        match = re.match(r"([A-Za-z]+)([.,;:]*)", word)
        if match:
            clean_word, punctuation = match.groups()
            cursor.execute("SELECT word_abbreviated FROM abbreviations WHERE word_full = ?", (clean_word.capitalize(),))
            result = cursor.fetchone()
            if result:
                corrected_words.append(result[0] + punctuation)
            else:
                corrected_words.append(word)
        else:
            corrected_words.append(word)
            
    conn.close()
    return " ".join(corrected_words)

def validate_and_fix(raw_citation):
    """Processes citation strings for institutional abbreviations."""
    if "," not in raw_citation:
        return raw_citation 

    case_name, reporter_info = raw_citation.split(",", 1)
    
    if " v. " in case_name:
        parties = case_name.split(" v. ")
        new_parties = []
        for party in parties:
            if len(party.split()) > 1:
                new_parties.append(abbreviate_string(party))
            else:
                new_parties.append(party)
        case_name = " v. ".join(new_parties)
    
    return f"{case_name},{reporter_info}"

@app.route('/')
def home():
    """This is what you see in the browser; it means the server is healthy."""
    return jsonify({
        "status": "online",
        "service": "bluebot legal auditor API",
        "documentation": "https://github.com/saimongh/bluebot"
    })

@app.route('/scan-document', methods=['POST'])
def scan():
    data = request.json
    full_text = data.get('text', '')
    
    # Regex pattern for standard Bluebook citations
    pattern = r"([A-Z][A-Za-z\s\.\',]+ v\. [A-Z][A-Za-z\s\.\',]+, \d+ [A-Z][A-Za-z\.\d\s]+ \d+ \(\d{4}\))"
    
    findings = []
    matches = list(re.finditer(pattern, full_text))
    last_case_key = None 

    for match in matches:
        raw_cite = match.group(0)
        start, end = match.span()
        
        # Identifier for the Id. state machine
        current_case_key = raw_cite.split(',')[0].strip().lower()
        fixed_cite = validate_and_fix(raw_cite)
        is_repeat = (current_case_key == last_case_key) if last_case_key else False
        
        if is_repeat:
            suggested_output = "Id."
            needs_fix = True
        else:
            suggested_output = fixed_cite
            needs_fix = (raw_cite != fixed_cite)

        findings.append({
            "original": raw_cite,
            "suggested": suggested_output,
            "start": start,
            "end": end,
            "needs_fix": needs_fix,
            "is_repeat": is_repeat
        })
        
        last_case_key = current_case_key

    return jsonify({"findings": findings})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
