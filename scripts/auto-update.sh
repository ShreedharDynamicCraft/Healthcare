#!/bin/bash

# Auto Git Update Script for Healthcare Platform
# This script automatically stages, commits, and pushes changes to keep the repository updated

echo "🔄 Starting auto-update process..."

# Navigate to the project directory
cd /Users/shreedhar/Assignment/assesment

# Check if there are any changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Changes detected, preparing to commit..."
    
    # Add all changes
    git add .
    
    # Create a timestamp for the commit
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Commit with automatic message
    git commit -m "auto-update: Platform improvements and fixes - $TIMESTAMP"
    
    # Push to remote repository
    git push
    
    echo "✅ Changes have been committed and pushed successfully!"
else
    echo "ℹ️  No changes detected, repository is up to date."
fi

echo "🏁 Auto-update process completed."
