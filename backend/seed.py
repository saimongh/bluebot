import sqlite3

# connect to your database file
conn = sqlite3.connect('bluebook.db')
cursor = conn.cursor()

# a list of tuples representing the data for our table
# format: (word_full, word_abbreviated, category, rule_source)
data_to_insert = [
    ('University', 'Univ.', 'Institution', 'T6'),
    ('Association', "Ass'n", 'Entity', 'T6'),
    ('Commission', "Comm'n", 'Entity', 'T6'),
    ('Department', "Dep't", 'Entity', 'T6'),
    ('Government', "Gov't", 'Entity', 'T6'),
    ('Incorporated', 'Inc.', 'Entity', 'T6'),
    ('California', 'Cal.', 'Geography', 'T10'),
    ('New York', 'N.Y.', 'Geography', 'T10'),
    ('District', 'Dist.', 'Entity', 'T6'),
    ('Company', 'Co.', 'Entity', 'T6'),
    ('Corporation', 'Corp.', 'Entity', 'T6'),
    ('International', "Int'l", 'Entity', 'T6'),
    ('Administrative', 'Admin.', 'Status', 'T6'),
    ('Journal', 'J.', 'Periodical', 'T13'),
    ('Review', 'Rev.', 'Periodical', 'T13'),
    ('Quarterly', 'Q.', 'Periodical', 'T13'),
    ('American', 'Am.', 'Entity', 'T6'),
    ('Foundation', 'Found.', 'Entity', 'T6'),
    ('Institute', 'Inst.', 'Entity', 'T6'),
    ('Society', 'Soc.', 'Entity', 'T6')
]

# the '?' are placeholders that prevent 'sql injection' (a common security bug)
query = "INSERT INTO abbreviations (word_full, word_abbreviated, category, rule_source) VALUES (?, ?, ?, ?)"

# execute the insert for the whole list at once
cursor.executemany(query, data_to_insert)

# COMMIT the changes so they are saved to the file permanently
conn.commit()

print(f"success! added {len(data_to_insert)} abbreviations to the database.")

conn.close()
