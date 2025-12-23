import csv
import json

with open(r'c:\Users\Ploti\Downloads\Hanoël - Cérémonie 2025 Good.csv', 'r', encoding='utf-8') as f:
    lines = f.readlines()

headers = lines[0].strip().split(';')

participants = ['Aloïs', 'Damien', 'Dylan', 'Flo', 'Hubert', 'Jonathan', 'Julia', 'Lodu', 'Momo', 'PA', 'Sachin', 'Seb', 'Skander', 'Stan', 'Thibaud', 'Thomas', 'Willy', 'Yoan', 'Youcef']

categories = []
for header in headers:
    if header.startswith('Top 1 ') and '[' in header:
        category = header.replace('Top 1 ', '').split(' [')[0]
        if category not in categories:
            categories.append(category)

results = {}

for category in categories:
    category_columns = {}
    for participant in participants:
        col_name = f'Top 1 {category} [{participant}]'
        if col_name in headers:
            category_columns[participant] = headers.index(col_name)
    
    scores = {}
    for participant in participants:
        scores[participant] = {'Top 1': 0, 'Top 2': 0, 'Top 3': 0, 'total_points': 0}
    
    for line in lines[1:]:
        if line.strip():
            values = line.strip().split(';')
            for participant, col_index in category_columns.items():
                if col_index < len(values):
                    value = values[col_index]
                    if value == "Top 1":
                        scores[participant]['Top 1'] += 1
                        scores[participant]['total_points'] += 3
                    elif value == "Top 2":
                        scores[participant]['Top 2'] += 1
                        scores[participant]['total_points'] += 2
                    elif value == "Top 3":
                        scores[participant]['Top 3'] += 1
                        scores[participant]['total_points'] += 1
    
    nominees = [p for p in participants if scores[p]['total_points'] > 0]
    sorted_scores = sorted([(p, scores[p]) for p in nominees], key=lambda x: x[1]['total_points'], reverse=True)
    
    results[category] = {
        'nominees': nominees,
        'rankings': sorted_scores
    }

with open('data.js', 'w', encoding='utf-8') as f:
    f.write('const awardsData = ')
    json.dump(results, f, ensure_ascii=False, indent=2)
    f.write(';')

print("✅ Données exportées vers data.js")
print(f"📊 {len(categories)} catégories traitées")
print(f"👥 {len(participants)} participants")
