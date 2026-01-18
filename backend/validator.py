import sqlite3
import re
import os

# FIX: Ensure the database path works locally and on Render
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'bluebook.db')

def validate_and_fix(raw_citation):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    words = raw_citation.split()
    corrected_words = []
    changes_made = 0
    
    for word in words:
        # Strip punctuation for lookup
        clean_word = re.sub(r'[.,]', '', word)
        
        # Use Case-Insensitive lookup or capitalize for Bluebook standards
        cursor.execute("SELECT word_abbreviated FROM abbreviations WHERE word_full = ?", (clean_word.capitalize(),))
        result = cursor.fetchone()
        
        if result:
            # Reattach the original punctuation (commas/periods) to the abbreviation
            punctuation = "".join(re.findall(r'[.,]', word))
            corrected_words.append(result[0] + punctuation)
            changes_made += 1
        else:
            corrected_words.append(word)
            
    conn.close()
    
    corrected_citation = " ".join(corrected_words)
    return corrected_citation, changes_made
