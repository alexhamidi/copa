from Bio.PDB import PDBParser, Selection, NeighborSearch
from Bio.PDB.DSSP import DSSP
from propka import run
from itertools import combinations
import sys
import json
import numpy as np
import warnings
from Bio.PDB.PDBExceptions import PDBConstructionWarning

warnings.filterwarnings("ignore", category=PDBConstructionWarning)

def convert_to_serializable(obj):
    if isinstance(obj, np.float32):
        return float(obj)
    elif isinstance(obj, dict):
        return {k: convert_to_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(i) for i in obj]
    else:
        return obj

def parse(pdb_file_path):
    parser = PDBParser()
    structure = parser.get_structure('pdb_structure', pdb_file_path)
    atoms = list(structure.get_atoms())
    ns = NeighborSearch(atoms)

    # Initialize DSSP
    model = structure[0]
    dssp = DSSP(model, pdb_file_path)

    cysteine_thiol_info = {}
    sulfur_atoms = []  # List to store (res_id, SG_atom) tuples

    res_list = Selection.unfold_entities(structure, "R")
    for residue in res_list:
        if residue.get_resname() == 'CYS' and 'SG' in residue:
            res_id = residue.get_id()[1]
            sg_atom = residue['SG']
            current_thiol = {'asa': None, 'p_ka_of_s0': None, 's1_distance': float('inf')}

            # Get surrounding amino acids
            surrounding_amino_acids = []
            nearby_atoms = ns.search(residue['CA'].coord, 10.0, level='R')
            for neighbor_residue in nearby_atoms:
                if neighbor_residue != residue:
                    surrounding_amino_acids.append({
                        'residue_name': neighbor_residue.resname,
                        'residue_number': neighbor_residue.id[1]
                    })
            current_thiol['surrounding_amino_acids'] = surrounding_amino_acids

            # Calculate ASA for SG atom
            dssp_key = (residue.get_parent().get_id(), residue.get_id())
            if dssp_key in dssp:
                dssp_data = dssp[dssp_key]
                relative_asa = dssp_data[3]  # Relative SASA is the 4th element in the DSSP tuple
                absolute_asa = relative_asa * 140  # Convert to absolute ASA
                current_thiol['asa'] = absolute_asa

            # Store SG atom for distance calculation
            sulfur_atoms.append((res_id, sg_atom))

            cysteine_thiol_info[res_id] = current_thiol

    # Calculate distances between SG atoms
    for (res_id1, sulfur1), (res_id2, sulfur2) in combinations(sulfur_atoms, 2):
        distance = sulfur1 - sulfur2
        # Update s1 for res_id1
        if distance < cysteine_thiol_info[res_id1]['s1_distance']:
            cysteine_thiol_info[res_id1]['s1_distance'] = distance
        # Update s1 for res_id2
        if distance < cysteine_thiol_info[res_id2]['s1_distance']:
            cysteine_thiol_info[res_id2]['s1_distance'] = distance

    # Calculate pKa values for thiol groups
    molecule = run.single(pdb_file_path)
    for group in molecule.conformations['AVR'].groups:
        if group.residue_type == 'CYS':
            residue_number = group.atom.res_num
            pka_value = group.pka_value
            if residue_number in cysteine_thiol_info:
                cysteine_thiol_info[residue_number]['p_ka_of_s0'] = pka_value

    return cysteine_thiol_info

def main(argv):
    if len(argv) < 1:
        print("Error: PDB file path is required.")
        sys.exit(1)

    pdb_file = argv[0]
    try:
        result = parse(pdb_file)
        serializable_result = convert_to_serializable(result)
        print(json.dumps(serializable_result, indent=2))
    except FileNotFoundError as fnfe:
        print(f"File not found error: {str(fnfe)}")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main(sys.argv[1:])
