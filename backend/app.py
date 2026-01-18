from flask import Flask, request, jsonify
from flask_cors import CORS
from validator import validate_and_fix
import re

app = Flask(__name__)
CORS(app)

@app.route('/scan-document', methods=['POST'])
def scan():
    data = request.json
    full_text = data.get('text', '')
    
    # Regex to capture standard Case Name, Volume Reporter Page (Year) format
    pattern = r"([A-Z][A-Za-z\s\.\',]+ v\. [A-Z][A-Za-z\s\.\',]+, \d+ [A-Z][A-Za-z\.\d\s]+ \d+ \(\d{4}\))"
    
    findings = []
    matches = list(re.finditer(pattern, full_text))
    last_case_key = None # Tracks the core parties to identify repeats

    for match in matches:
        raw_cite = match.group(0)
        start, end = match.span()
        
        # Normalize the case name to check for repetition regardless of original formatting
        current_case_key = raw_cite.split(',')[0].strip().lower()
        
        # Get the standard Bluebook abbreviation
        fixed_cite = validate_and_fix(raw_cite)
        
        # Sequence logic: Is this citation referring to the same case as the one immediately before it?
        is_repeat = (current_case_name_key == last_case_key) if last_case_key else False
        
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