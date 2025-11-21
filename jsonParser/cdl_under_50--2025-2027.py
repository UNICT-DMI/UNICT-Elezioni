#!/usr/bin/env python3
"""
Improved parser for cdlb_-_scrutinio.txt handling both table formats
"""
import json
import re
import os

def parse_course_data(text):
    """Parse the cdlb_-_scrutinio.txt file handling both layout formats"""
    
    # Split by course sections
    sections = text.split('ELEZIONI RAPPRESENTANTI STUDENTI IN SENO AL CONSIGLIO DEL CORSO DI LAUREA IN:')
    
    parsed_courses = []
    
    for section in sections[1:]:  # Skip first empty split
        lines = [l.strip() for l in section.strip().split('\n')]
        
        if len(lines) < 5:
            continue
        
        # First line is course name
        course_name = lines[0]
        if not course_name:
            continue
        
        # Find key indices
        biennio_idx = None
        candidati_idx = None
        voti_idx = None
        schede_bianche_idx = None
        totale_voti_idx = None
        
        for i, line in enumerate(lines):
            if 'BIENNIO' in line:
                biennio_idx = i
            elif line == 'CANDIDATI':
                candidati_idx = i
            elif line == 'VOTI':
                voti_idx = i
            elif 'SCHEDE BIANCHE' in line:
                schede_bianche_idx = i
            elif line == 'TOTALE VOTI':
                totale_voti_idx = i
        
        # Extract seggi_da_assegnare (usually right after BIENNIO)
        seggi_da_assegnare = None
        if biennio_idx:
            for i in range(biennio_idx + 1, min(biennio_idx + 5, len(lines))):
                if lines[i].isdigit():
                    seggi_da_assegnare = int(lines[i])
                    break
        
        # Determine format by checking where candidate names appear
        # Format 1: candidate names appear AFTER VOTI
        # Format 2: candidate names appear BEFORE VOTI or between CANDIDATI and SCHEDE BIANCHE
        format_type = 1  # default
        if candidati_idx and voti_idx and schede_bianche_idx:
            # Check if there are any candidate names between CANDIDATI and min(VOTI, SCHEDE BIANCHE)
            check_end = min(voti_idx, schede_bianche_idx)
            found_name_before_voti = False
            for i in range(candidati_idx + 1, check_end):
                line = lines[i]
                if line and any(c.isalpha() for c in line) and not line.isdigit() and line != 'Eletto' and line != 'VOTI':
                    found_name_before_voti = True
                    break
            
            # Also check for consecutive names after VOTI (for cases like ELETTRONICA)
            consecutive_names = 0
            for i in range(voti_idx + 1, min(voti_idx + 30, len(lines))):
                line = lines[i]
                if line and any(c.isalpha() for c in line) and not line.isdigit() and line != 'Eletto' and line != 'VOTI':
                    consecutive_names += 1
                    if consecutive_names >= 3:
                        break
                elif line and line.isdigit():
                    consecutive_names = 0
            
            if found_name_before_voti or consecutive_names >= 3:
                format_type = 2
        
        # Helper function to find next non-empty line with a number
        def find_next_number(start_idx):
            for i in range(start_idx + 1, len(lines)):
                if lines[i] and lines[i].replace(',', '').replace('.', '').replace('%', '').replace('-', '').isdigit():
                    return lines[i]
            return None
        
        # Extract schede info - method depends on format
        schede_bianche = 0
        schede_nulle = 0
        schede_contestate = 0
        
        # For Format 1, schede values appear after the label
        # For Format 2, schede values are extracted from vote_numbers later
        if format_type == 1:
            if schede_bianche_idx:
                val = find_next_number(schede_bianche_idx)
                if val:
                    try:
                        schede_bianche = int(val)
                    except:
                        pass
            
            for i, line in enumerate(lines):
                if 'SCHEDE NULLE' in line:
                    val = find_next_number(i)
                    if val:
                        try:
                            schede_nulle = int(val)
                        except:
                            pass
                if 'SCHEDE CONTESTATE' in line:
                    val = find_next_number(i)
                    if val:
                        try:
                            schede_contestate = int(val)
                        except:
                            pass
        
        # Extract totale_voti
        totale_voti = 0
        if totale_voti_idx:
            val = find_next_number(totale_voti_idx)
            if val:
                try:
                    totale_voti = int(val)
                except:
                    pass
        
        # Extract aventi_diritto
        aventi_diritto = 0
        for i, line in enumerate(lines):
            if 'AVENTI DIRITTO' in line:
                val = find_next_number(i)
                if val:
                    try:
                        aventi_diritto = int(val)
                    except:
                        pass
                break
        
        # Extract perc_votanti
        perc_votanti = 0.0
        for i, line in enumerate(lines):
            if '% VOTANTI' in line:
                val = find_next_number(i)
                if val:
                    try:
                        perc_str = val.replace('%', '').replace(',', '.')
                        perc_votanti = float(perc_str)
                    except:
                        pass
                break
        
        # Parse candidates - handle two formats
        eletti = []
        non_eletti = []
        
        # Helper function to find next non-empty line
        def find_next_nonempty(start_idx):
            for i in range(start_idx + 1, len(lines)):
                if lines[i]:
                    return i, lines[i]
            return None, None
        
        # Parse based on determined format
        if candidati_idx and voti_idx and schede_bianche_idx:
            if format_type == 1:
                # Format 1: CANDIDATI, VOTI, then interleaved name/votes
                # Like ARCHEOLOGIA
                i = voti_idx + 1
                while i < schede_bianche_idx:
                    line = lines[i]
                    
                    # Skip empty lines
                    if not line:
                        i += 1
                        continue
                    
                    # Skip "Eletto" standalone
                    if line == 'Eletto':
                        i += 1
                        continue
                    
                    # Check if this is a candidate name (has letters)
                    if any(c.isalpha() for c in line) and not line.isdigit():
                        nome = line
                        voti = 0
                        eletto = False
                        
                        # Find next non-empty line for votes
                        next_idx, next_line = find_next_nonempty(i)
                        if next_line and next_line.isdigit():
                            voti = int(next_line)
                            i = next_idx
                            
                            # Check for "Eletto" on next non-empty line
                            eletto_idx, eletto_line = find_next_nonempty(i)
                            if eletto_line and eletto_line == 'Eletto':
                                eletto = True
                                i = eletto_idx
                        
                        candidato = {
                            "nome_candidato": nome,
                            "voti": voti
                        }
                        
                        if eletto:
                            eletti.append(candidato)
                        else:
                            non_eletti.append(candidato)
                    
                    i += 1
            
            else:
                # Format 2: CANDIDATI, names listed, SCHEDE BIANCHE, VOTI, numbers listed
                # Like MATEMATICA or INGEGNERIA ELETTRONICA
                # In this format, names are listed first (possibly after VOTI header), 
                # then VOTI header (or in the candidate section), then numbers
                # The numbers correspond to: candidate1_votes, candidate2_votes, ..., schede_bianche_value
                
                # Extract candidate names - between CANDIDATI and SCHEDE BIANCHE
                # But skip the "VOTI" line if it appears in this range
                candidate_names = []
                i = candidati_idx + 1
                while i < schede_bianche_idx:
                    line = lines[i]
                    # Skip empty, skip "VOTI", skip pure numbers
                    if line and line != 'VOTI' and any(c.isalpha() for c in line) and not line.isdigit():
                        candidate_names.append(line)
                    i += 1
                
                # Extract vote numbers after VOTI (wherever it is)
                vote_numbers = []
                i = voti_idx + 1
                while i < totale_voti_idx if totale_voti_idx else len(lines):
                    line = lines[i]
                    if line and line.isdigit():
                        vote_numbers.append(int(line))
                    i += 1
                
                # Count "Eletto" markers
                eletto_count = sum(1 for line in lines if line == 'Eletto')
                
                # Match names with votes
                temp_candidates = []
                for idx, name in enumerate(candidate_names):
                    if idx < len(vote_numbers):
                        voti = vote_numbers[idx]
                        candidato = {
                            "nome_candidato": name,
                            "voti": voti
                        }
                        temp_candidates.append(candidato)
                
                # Sort by votes and assign eletti/non_eletti based on eletto_count
                if eletto_count > 0 and temp_candidates:
                    temp_candidates.sort(key=lambda x: x['voti'], reverse=True)
                    eletti = temp_candidates[:eletto_count]
                    non_eletti = temp_candidates[eletto_count:]
                else:
                    non_eletti = temp_candidates
                
                # Extract schede_bianche from vote_numbers
                # It should be the number after all candidate votes
                if len(vote_numbers) > len(candidate_names):
                    schede_bianche = vote_numbers[len(candidate_names)]
        
        # Determine quorum
        quorum = perc_votanti >= 50.0
        
        course_data = {
            "dipartimento": course_name,
            "quorum": quorum,
            "seggi_da_assegnare": seggi_da_assegnare,
            "schede": {
                "bianche": schede_bianche,
                "nulle": schede_nulle,
                "contestate": schede_contestate
            },
            "eletti": eletti,
            "non_eletti": non_eletti,
            "totale_voti": totale_voti,
            "aventi_diritto": aventi_diritto,
            "perc_votanti": perc_votanti
        }
        
        parsed_courses.append(course_data)
    
    return parsed_courses

def create_filename(course_name):
    """Create a filename from course name matching 2023-2025 naming"""
    # Extract the main part before the degree code
    main_name = course_name.split('-')[0].strip()
    
    # Convert to lowercase and replace spaces with underscores
    filename = main_name.lower()
    filename = filename.replace(' ', '_')
    filename = filename.replace("'", '')
    filename = filename.replace(',', '')
    filename = filename.replace('à', 'a')
    filename = filename.replace('è', 'e')
    filename = filename.replace('é', 'e')
    filename = filename.replace('ì', 'i')
    filename = filename.replace('ò', 'o')
    filename = filename.replace('ù', 'u')
    
    # Special cases to match 2023-2025 naming
    if 'informatica' in filename and 'lm-18' in course_name.lower():
        return 'informatica_magistrale.json'
    elif filename == 'matematica' and 'lm-40' in course_name.lower():
        return 'matematica_magistrale.json'
    elif filename == 'ingegneria_meccanica' and 'lm-33' in course_name.lower():
        return 'mechanical_engineering.json'
    elif 'ingegneria_elettronica' in filename and 'l-8' in course_name.lower():
        return 'electronic_engineering.json'
    elif 'ingegneria_edile' in filename:
        return 'ingegneria_edile-architettura.json'
    
    return filename + '.json'

if __name__ == '__main__':
    # Read the input file
    with open('cdlb_-_scrutinio.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse courses
    courses = parse_course_data(content)
    
    print(f"Parsed {len(courses)} courses")
    
    # Create JSON files
    output_dir = 'src/data/2025-2027/Corso di Laurea <500'
    os.makedirs(output_dir, exist_ok=True)
    
    for course in courses:
        filename = create_filename(course['dipartimento'])
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(course, f, indent=2, ensure_ascii=False)
        
        print(f"Created: {filename}")
    
    print(f"\nAll {len(courses)} JSON files created successfully!")
