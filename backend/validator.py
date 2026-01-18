import sqlite3
import re
import os

# Resolves the path to bluebook.db regardless of the environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'bluebook.db')

def validate_and_fix(raw_citation):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    words = raw_citation.split()
    corrected_words = []
    changes_made = 0
    
    for word in words:
        clean_word = re.sub(r'[.,]', '', word)
        cursor.execute("SELECT word_abbreviated FROM abbreviations WHERE word_full = ?", (clean_word.capitalize(),))
        result = cursor.fetchone()
        
        if result:
            punctuation = "".join(re.findall(r'[.,]', word))
            corrected_words.append(result[0] + punctuation)
            changes_made += 1
        else:
            corrected_words.append(word)
            
    conn.close()
    return " ".join(corrected_words), changes_made
