#!/usr/bin/env python3
"""
WisePath System - Pre-flight Verification Script
Checks all system requirements and configuration before running
"""

import os
import sys
import json
import subprocess
from pathlib import Path

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    """Print a formatted header"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.RESET}\n")

def check_success(message):
    """Print success message"""
    print(f"{Colors.GREEN}✅ {message}{Colors.RESET}")

def check_error(message):
    """Print error message"""
    print(f"{Colors.RED}❌ {message}{Colors.RESET}")

def check_warning(message):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.RESET}")

def check_info(message):
    """Print info message"""
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.RESET}")

def check_command(command, name):
    """Check if a command is available"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            check_success(f"{name} installed: {version}")
            return True
        else:
            check_error(f"{name} not found")
            return False
    except Exception as e:
        check_error(f"Error checking {name}: {e}")
        return False

def check_file(filepath, description):
    """Check if a file exists"""
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        check_success(f"{description} exists ({size:,} bytes)")
        return True
    else:
        check_error(f"{description} missing: {filepath}")
        return False

def check_json_valid(filepath, description):
    """Check if a JSON file is valid"""
    try:
        with open(filepath, 'r') as f:
            json.load(f)
        check_success(f"{description} is valid JSON")
        return True
    except json.JSONDecodeError as e:
        check_error(f"{description} has invalid JSON: {e}")
        return False
    except FileNotFoundError:
        check_error(f"{description} not found")
        return False

def verify_package_json(filepath):
    """Verify package.json has all required packages"""
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        required_deps = [
            'react', 'react-native', 'expo',
            '@react-navigation/native',
            '@react-navigation/native-stack',
            '@react-navigation/bottom-tabs',
            'react-native-gesture-handler',
            'firebase',
        ]
        
        deps = data.get('dependencies', {})
        missing = [dep for dep in required_deps if dep not in deps]
        
        if missing:
            check_error(f"Missing packages: {', '.join(missing)}")
            return False
        else:
            check_success(f"All required packages present ({len(deps)} total)")
            return True
    except Exception as e:
        check_error(f"Error checking package.json: {e}")
        return False

def verify_env_file(filepath):
    """Verify .env file has required variables"""
    try:
        if not os.path.exists(filepath):
            check_warning(".env file not found (will use defaults)")
            return True
        
        with open(filepath, 'r') as f:
            content = f.read()
        
        required_vars = [
            'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
            'EXPO_PUBLIC_FIREBASE_API_KEY',
            'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
        ]
        
        missing = [var for var in required_vars if var not in content]
        
        if missing:
            check_warning(f"Missing env variables: {', '.join(missing)}")
            return True  # Not critical
        else:
            check_success(".env file has all required variables")
            return True
    except Exception as e:
        check_warning(f"Error checking .env: {e}")
        return True

def verify_directory_structure(base_path):
    """Verify project directory structure"""
    required_dirs = [
        'src',
        'src/screens',
        'src/components',
        'src/navigation',
        'src/context',
        'src/services',
        'src/config',
        'assets',
    ]
    
    missing = []
    for dir_path in required_dirs:
        full_path = os.path.join(base_path, dir_path)
        if not os.path.isdir(full_path):
            missing.append(dir_path)
    
    if missing:
        check_error(f"Missing directories: {', '.join(missing)}")
        return False
    else:
        check_success(f"All {len(required_dirs)} required directories present")
        return True

def main():
    """Run all verification checks"""
    print(f"""
    {Colors.BOLD}{Colors.CYAN}╔════════════════════════════════════════════════════════════╗
    ║        WisePath System - Pre-flight Verification         ║
    ╚════════════════════════════════════════════════════════════╝{Colors.RESET}
    """)
    
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)
    
    all_checks_passed = True
    
    # System Requirements
    print_header("1️⃣  System Requirements")
    if not check_command("node --version", "Node.js"):
        all_checks_passed = False
    if not check_command("npm --version", "npm"):
        all_checks_passed = False
    
    # Configuration Files
    print_header("2️⃣  Configuration Files")
    if not check_json_valid("package.json", "package.json"):
        all_checks_passed = False
    if not check_json_valid("app.json", "app.json"):
        all_checks_passed = False
    if not check_file("tsconfig.json", "TypeScript config"):
        all_checks_passed = False
    if not check_file("babel.config.js", "Babel config"):
        all_checks_passed = False
    if not check_file("tailwind.config.js", "Tailwind config"):
        all_checks_passed = False
    
    # Dependencies
    print_header("3️⃣  Dependencies Check")
    if not verify_package_json("package.json"):
        all_checks_passed = False
    
    # Environment
    print_header("4️⃣  Environment Configuration")
    if not verify_env_file(".env"):
        all_checks_passed = False
    
    # Directory Structure
    print_header("5️⃣  Project Structure")
    if not verify_directory_structure(project_dir):
        all_checks_passed = False
    
    # Summary
    print_header("Summary")
    if all_checks_passed:
        check_success("All checks passed! System is ready to run.")
        print(f"\n{Colors.BOLD}Next steps:{Colors.RESET}")
        print("1. Run: npm install")
        print("2. Run: npm run web")
        print("3. Open: http://localhost:19006\n")
        return 0
    else:
        check_warning("Some checks failed. Please review the issues above.")
        print(f"\n{Colors.BOLD}Troubleshooting:{Colors.RESET}")
        print("1. Ensure Node.js and npm are installed")
        print("2. Run: npm install")
        print("3. Check that all directories exist")
        print("4. Verify .env file has correct configuration\n")
        return 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Verification cancelled.{Colors.RESET}")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Colors.RED}Unexpected error: {e}{Colors.RESET}")
        sys.exit(1)
