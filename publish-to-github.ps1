# Publish to GitHub Pages helper script
# Usage: run in PowerShell from the repo root
# It will try to use `gh` (GitHub CLI). If not present, it prints the git commands to run manually.

param(
    [string]$RepoName = '',
    [string]$Remote = 'origin',
    [string]$Branch = 'main'
)

function Ensure-Git {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "git no está instalado o no está en PATH. Instala Git y vuelve a intentarlo."
        exit 1
    }
}

Set-Location -Path (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)

Ensure-Git

# Ensure docs folder exists
if (-not (Test-Path -Path './docs')) { Write-Output "No existe ./docs — crea o copia tus archivos estáticos allí antes de publicar."; exit 1 }

# Initialize repo if needed
if (-not (Test-Path -Path '.git')) {
    git init
    git add .
    git commit -m "Initial commit"
    Write-Output "Repositorio git inicializado y commit creado."
}

# If gh is available, try to create repo and push
if (Get-Command gh -ErrorAction SilentlyContinue) {
    if (-not $RepoName -or $RepoName -eq '') {
        $RepoName = Read-Host 'Nombre del repositorio en GitHub (ej: mi-portfolio)'
    }
    # create repo (private by default: false)
    gh repo create $RepoName --public --source=. --remote $Remote --push
    if ($LASTEXITCODE -ne 0) { Write-Error "gh falló o no pudo crear el repo."; exit 1 }
    Write-Output "Repositorio creado y push realizado. Ahora habilita Pages en GitHub: Settings -> Pages -> Branch: $Branch /docs (o usa la interfaz gh)."
    # Enable Pages via gh (if supported)
    try { gh api -X PUT /repos/:owner/:repo/pages --input - -F source.branch=$Branch -F source.path=/docs } catch { Write-Output 'No se pudo habilitar Pages por CLI; habilítalo en GitHub Settings -> Pages.' }
    Write-Output "He intentado habilitar Pages; revisa el repositorio en GitHub para confirmar."
    exit 0
}

# If gh not found, show manual commands
Write-Output "gh (GitHub CLI) no está instalado. Ejecuta los siguientes comandos manualmente (ajusta <GIT_URL>):"
Write-Output '---'
Write-Output 'git add .'
Write-Output 'git commit -m "Publish site"'
Write-Output 'git branch -M main'
Write-Output 'git remote add origin <GIT_URL>  # reemplaza con tu URL de repo (ej: https://github.com/usuario/mi-portfolio.git)'
Write-Output 'git push -u origin main'
Write-Output ''
Write-Output "Luego en GitHub, ve a Settings -> Pages y configura la rama `main` / carpeta `/docs` para publicar GitHub Pages."
Write-Output '---'
Write-Output 'Si quieres puedo crear un repo usando un PAT; proporciona uno temporalmente o instala y autentica con `gh auth login`.'
