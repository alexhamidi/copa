from Bio.PDB import PDBParser
from Bio.PDB.NACCESS import NACCESS
from Bio.PDB.NeighborSearch import NeighborSearch
from propka import run
from itertools import combinations
import sys
import io
import json
import os



def parse(pdb_content):
    parser = PDBParser()

    structure = parser.get_structure('pdb_structure', io.StringIO(pdb_content))
    atoms = list(structure.get_atoms())
    ns = NeighborSearch(atoms)

    with open('temp.pdb', 'w') as temp_file:
        temp_file.write(pdb_content)

    try:
        naccess_instance = NACCESS(structure, pdb_file='temp.pdb')

        cysteine_residues_info = {}

        #get Amino Acids and ASA
        sulfur_atoms = [] #need to populate
        for model in structure: #
            for chain in model:
                for residue in chain:
                    if residue.get_resname() == 'CYS':
                        res_id = residue.id[1]
                        current_residue = {'asa': None, 'p_ka_of_s0': None, 's1_distance': float('inf')}

                        # Get surrounding amino acids
                        surrounding_amino_acids = []
                        nearby_atoms = ns.search(residue['CA'].coord, 10.0, level='R')
                        for neighbor_residue in nearby_atoms:
                            if neighbor_residue != residue:
                                surrounding_amino_acids.append({
                                    'residue_name': neighbor_residue.resname,
                                    'residue_number': neighbor_residue.id[1]
                                })
                        current_residue['surrounding_amino_acids'] = surrounding_amino_acids


                        #get asa
                        residue_key = (chain.id, residue.id)
                        if residue_key in naccess_instance:
                            residue_asa = naccess_instance[residue_key]['all_atoms_rel']
                            current_residue['asa'] = residue_asa

                        #add atom to list
                        if 'SG' in residue:
                            sulfur_atoms.append((res_id, residue['SG']))

                        cysteine_residues_info[res_id] = current_residue

        #get distances
        for (res_id1, sulfur1), (res_id2, sulfur2) in combinations(sulfur_atoms, 2): # get all combos
            distance = sulfur1 - sulfur2

            # Update s1 for res_id1
            if 's1_distance' not in cysteine_residues_info[res_id1] or distance < cysteine_residues_info[res_id1]['s1'][1]:
                cysteine_residues_info[res_id1]['s1_distance'] = distance

            # Update s1 for res_id2
            if 's1_distance' not in cysteine_residues_info[res_id2] or distance < cysteine_residues_info[res_id2]['s1'][1]:
                cysteine_residues_info[res_id2]['s1_distance'] = distance

        #get pkas
        molecule = run.single('temp.pdb')
        for group in molecule.conformations['AVR'].groups:
                if group.type == 'CYS':
                    residue_number = group.residue_number
                    if residue_number in cysteine_residues_info:
                        cysteine_residues_info[residue_number]['p_ka_of_s0'] = round(group.pka_value, 2)

    finally:
        os.remove('temp.pdb')

    return cysteine_residues_info

def main(argv):
    if len(argv) < 1:
        print("Error: PDB content is required.")
        sys.exit(1)

    pdb_content = argv[0]
    try:
        result = parse(pdb_content)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main(sys.argv[1:])
