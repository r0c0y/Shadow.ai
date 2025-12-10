import subprocess
import os
import json

def test_diagnose_error():
    print("Testing diagnose_error.sh...")
    # Create dummy log
    with open("build.log", "w") as f:
        f.write("Error: Dependency conflict in package-lock.json\n")
    
    try:
        result = subprocess.check_output(["./diagnose_error.sh", "build.log"], stderr=subprocess.STDOUT)
        print(result.decode())
    except subprocess.CalledProcessError as e:
        print(f"Failed: {e.output.decode()}")

    os.remove("build.log")

def test_autofix_deps():
    print("Testing autofix_deps.sh...")
    try:
        result = subprocess.check_output(["./autofix_deps.sh", "."], stderr=subprocess.STDOUT)
        print(result.decode())
    except subprocess.CalledProcessError as e:
        print(f"Failed: {e.output.decode()}")

if __name__ == "__main__":
    test_diagnose_error()
    print("-" * 20)
    test_autofix_deps()
