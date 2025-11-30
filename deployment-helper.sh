#!/bin/bash
# deployment-helper.sh - Quick deployment script for Infertility CDSS

echo "╔════════════════════════════════════════════════════════╗"
echo "║    Infertility CDSS - Deployment Helper               ║"
echo "║    Version 0.2.0                                       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}✗ Node.js not found. Please install Node.js 16+${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js found: $(node -v)${NC}"
}

check_npm() {
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}✗ npm not found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ npm found: $(npm -v)${NC}"
}

build_project() {
    echo -e "\n${BLUE}Building project...${NC}"
    npm run build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Build successful!${NC}"
    else
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    fi
}

test_local() {
    echo -e "\n${BLUE}Testing production build locally...${NC}"
    echo -e "${YELLOW}Starting preview server...${NC}"
    echo "Visit http://localhost:4173 in your browser"
    echo "Press Ctrl+C to stop"
    npm run preview
}

install_vercel() {
    echo -e "\n${BLUE}Installing Vercel CLI...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✓ Vercel CLI installed${NC}"
}

deploy_vercel() {
    echo -e "\n${BLUE}Deploying to Vercel...${NC}"
    vercel
}

install_netlify() {
    echo -e "\n${BLUE}Installing Netlify CLI...${NC}"
    npm install -g netlify-cli
    echo -e "${GREEN}✓ Netlify CLI installed${NC}"
}

deploy_netlify() {
    echo -e "\n${BLUE}Deploying to Netlify...${NC}"
    netlify deploy --prod --dir=dist
}

cleanup() {
    echo -e "\n${BLUE}Cleaning up...${NC}"
    rm -rf node_modules dist
    echo -e "${GREEN}✓ Cleaned${NC}"
}

# Main menu
show_menu() {
    echo ""
    echo -e "${BLUE}Select deployment option:${NC}"
    echo ""
    echo "1) Check prerequisites"
    echo "2) Build project"
    echo "3) Test locally"
    echo "4) Deploy to Vercel"
    echo "5) Deploy to Netlify"
    echo "6) Full workflow (build + test)"
    echo "7) Clean (remove node_modules)"
    echo "8) Exit"
    echo ""
    echo -n "Enter choice [1-8]: "
}

# Main
check_node
check_npm

while true; do
    show_menu
    read choice
    
    case $choice in
        1)
            echo -e "\n${BLUE}Checking prerequisites...${NC}"
            check_node
            check_npm
            ;;
        2)
            build_project
            ;;
        3)
            if [ ! -d "dist" ]; then
                echo -e "${YELLOW}Build not found. Building first...${NC}"
                build_project
            fi
            test_local
            ;;
        4)
            build_project
            install_vercel
            deploy_vercel
            ;;
        5)
            build_project
            install_netlify
            deploy_netlify
            ;;
        6)
            build_project
            test_local
            ;;
        7)
            cleanup
            ;;
        8)
            echo -e "\n${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            ;;
    esac
done
