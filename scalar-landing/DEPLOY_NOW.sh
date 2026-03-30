#!/bin/bash

# Scalar Landing Page - Deploy to Vercel Script
# Run this in your local Scalar folder after copying files from the server

set -e  # Exit on error

echo "🚀 Scalar Vercel Deployment Script"
echo "===================================="
echo ""

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Make sure you're in the Scalar project folder"
    exit 1
fi

echo "✅ Scalar project found"
echo ""

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 3: Initialize git (if not already initialized)
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git config user.name "Your Name"
    git config user.email "your.email@example.com"
    echo "ℹ️  Update the name and email in the commands above if needed"
else
    echo "✅ Git repository already initialized"
fi

echo ""

# Step 4: Add files to git
echo "📝 Adding files to git..."
git add .
git commit -m "Initial commit: Scalar landing page" || echo "⚠️  Git commit skipped (files already committed)"
echo "✅ Files committed"
echo ""

# Step 5: Next steps
echo "🎯 Next Steps:"
echo "============="
echo ""
echo "1. Create a GitHub repository at: https://github.com/new"
echo "   - Name: scalar-landing"
echo "   - Make it Public"
echo "   - Click 'Create repository'"
echo ""
echo "2. Copy the commands shown on GitHub (under 'push an existing repository')"
echo "   They'll look like:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/scalar-landing.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Run those GitHub commands in this terminal"
echo ""
echo "4. Go to https://vercel.com/dashboard"
echo "   - Click 'Add New' → 'Project'"
echo "   - Import your GitHub repo (scalar-landing)"
echo "   - Click 'Import'"
echo "   - Click 'Deploy'"
echo ""
echo "5. Wait 1-2 minutes for deployment to complete"
echo ""
echo "6. Your site will be live! 🎉"
echo ""
echo "===================================="
echo "✅ Local setup complete!"
echo "===================================="
echo ""
