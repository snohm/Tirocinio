import subprocess
import os
import sys

scripts = [
    'typeof_relation.py',
    'sameas_relation.py',
    'articles.py',
    'mapping.py',
]
try:
    for script in scripts:
        script_path = os.path.join('script/', script)
        print(f"Eseguendo: {script_path}")
        subprocess.run([sys.executable, script_path], check=True)
        
except subprocess.CalledProcessError as e:
    print("Errore durante l'esecuzione:", e.stderr)