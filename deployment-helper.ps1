# deployment-helper.ps1 - Deployment helper for Windows
# Run: powershell -ExecutionPolicy Bypass -File deployment-helper.ps1

Clear-Host
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    Infertility CDSS - Deployment Helper               ║" -ForegroundColor Cyan
Write-Host "║    Version 0.2.0                                       ║" -ForegroundColor Cyan
Write-Host "║    Windows PowerShell Edition                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

function Check-Node {
    try {
        $version = node -v
        Write-Host "✓ Node.js found: $version" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ Node.js not found. Please install Node.js 16+" -ForegroundColor Red
        return $false
    }
}

function Check-Npm {
    try {
        $version = npm -v
        Write-Host "✓ npm found: $version" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ npm not found" -ForegroundColor Red
        return $false
    }
}

function Build-Project {
    Write-Host "`nBuilding project..." -ForegroundColor Blue
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Build successful!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ Build failed" -ForegroundColor Red
        return $false
    }
}

function Test-Local {
    Write-Host "`nTesting production build locally..." -ForegroundColor Blue
    
    if (-not (Test-Path "dist")) {
        Write-Host "Build not found. Building first..." -ForegroundColor Yellow
        if (-not (Build-Project)) {
            return
        }
    }
    
    Write-Host "Starting preview server..." -ForegroundColor Yellow
    Write-Host "Visit http://localhost:4173 in your browser" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    npm run preview
}

function Install-Vercel {
    Write-Host "`nInstalling Vercel CLI..." -ForegroundColor Blue
    npm install -g vercel
    Write-Host "✓ Vercel CLI installed" -ForegroundColor Green
}

function Deploy-Vercel {
    Write-Host "`nDeploying to Vercel..." -ForegroundColor Blue
    Write-Host "Note: Make sure you're logged in to Vercel" -ForegroundColor Yellow
    vercel
}

function Install-Netlify {
    Write-Host "`nInstalling Netlify CLI..." -ForegroundColor Blue
    npm install -g netlify-cli
    Write-Host "✓ Netlify CLI installed" -ForegroundColor Green
}

function Deploy-Netlify {
    Write-Host "`nDeploying to Netlify..." -ForegroundColor Blue
    Write-Host "Note: Make sure you're logged in to Netlify" -ForegroundColor Yellow
    netlify deploy --prod --dir=dist
}

function Cleanup {
    Write-Host "`nCleaning up..." -ForegroundColor Blue
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force node_modules
    }
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force dist
    }
    Write-Host "✓ Cleaned" -ForegroundColor Green
}

function Show-Prerequisites {
    Write-Host "`n" -ForegroundColor Blue
    Write-Host "Checking prerequisites..." -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    
    if (Check-Node) {
        Write-Host ""
    } else {
        Write-Host "`nPlease install Node.js from https://nodejs.org/" -ForegroundColor Yellow
        return
    }
    
    if (Check-Npm) {
        Write-Host ""
    } else {
        Write-Host "`nPlease install npm" -ForegroundColor Yellow
        return
    }
    
    Write-Host "`n✓ All prerequisites met!" -ForegroundColor Green
}

function Show-Menu {
    Write-Host ""
    Write-Host "Select deployment option:" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    Write-Host ""
    Write-Host "1) Check prerequisites"
    Write-Host "2) Build project"
    Write-Host "3) Test locally"
    Write-Host "4) Deploy to Vercel"
    Write-Host "5) Deploy to Netlify"
    Write-Host "6) Full workflow (build + test)"
    Write-Host "7) Clean (remove node_modules)"
    Write-Host "8) Exit"
    Write-Host ""
}

# Check prerequisites first
if (-not (Check-Node -and Check-Npm)) {
    Write-Host "`nCannot proceed without Node.js and npm" -ForegroundColor Red
    exit 1
}

# Main loop
$running = $true
while ($running) {
    Show-Menu
    $choice = Read-Host "Enter choice [1-8]"
    
    switch ($choice) {
        "1" {
            Show-Prerequisites
        }
        "2" {
            Build-Project | Out-Null
        }
        "3" {
            Test-Local
        }
        "4" {
            Build-Project | Out-Null
            if ($?) {
                Install-Vercel
                Deploy-Vercel
            }
        }
        "5" {
            Build-Project | Out-Null
            if ($?) {
                Install-Netlify
                Deploy-Netlify
            }
        }
        "6" {
            Build-Project | Out-Null
            if ($?) {
                Test-Local
            }
        }
        "7" {
            Cleanup
        }
        "8" {
            Write-Host "`nGoodbye!" -ForegroundColor Green
            $running = $false
        }
        default {
            Write-Host "Invalid choice" -ForegroundColor Red
        }
    }
}
