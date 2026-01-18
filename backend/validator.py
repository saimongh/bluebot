import sqlite3
import re
import os

# Use a relative path to ensure it works on Render
DB_PATH = os.path.join(os.path.dirname(__file__), 'bluebook.db')

def abbreviate_string(text):
    """Core engine to abbreviate party names using the T6 database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    words = text.split()
    corrected_words = []
    
    for word in words:
        # Preserve trailing punctuation like commas or periods
        match = re.match(r"([A-Za-z]+)([.,;:]*)", word)
        if match:
            clean_word, punctuation = match.groups()
            # Case-insensitive lookup for words like 'University' or 'university'
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
    """Processes a single citation string and returns a Bluebook-ready version."""
    if "," not in raw_citation:
        return raw_citation 

    case_name, reporter_info = raw_citation.split(",", 1)
    
    if " v. " in case_name:
        parties = case_name.split(" v. ")
        new_parties = []
        for party in parties:
            # Bluebook Rule 10.2.1: Only abbreviate if the party name has multiple words
            if len(party.split()) > 1:
                new_parties.append(abbreviate_string(party))
            else:
                new_parties.append(party)
        case_name = " v. ".join(new_parties)
    
    return f"{case_name},{reporter_info}"