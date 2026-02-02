#!/bin/bash

# Script simplificado - prepara apenas o ambiente
# O repositório será clonado pelo GitHub Actions no primeiro deploy

set -e

echo "🚀 Preparando servidor para deploys automáticos..."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/var/www/cemig-dashboard"
USER=$(whoami)

# 1. Verificar Docker
if ! docker --version &> /dev/null; then
    echo -e "❌ Docker não encontrado"
    exit 1
fi
echo -e "${GREEN}✅ Docker: $(docker --version)${NC}"

# 2. Instalar Docker Compose V2
if ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Docker Compose...${NC}"
    COMPOSE_VERSION="v2.24.5"
    sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    mkdir -p ~/.docker/cli-plugins
    sudo mkdir -p /root/.docker/cli-plugins
    sudo cp /usr/local/bin/docker-compose ~/.docker/cli-plugins/docker-compose
    sudo cp /usr/local/bin/docker-compose /root/.docker/cli-plugins/docker-compose
    sudo chmod +x ~/.docker/cli-plugins/docker-compose
    sudo chmod +x /root/.docker/cli-plugins/docker-compose
fi
echo -e "${GREEN}✅ Docker Compose: $(docker compose version)${NC}"

# 3. Adicionar usuário ao grupo docker
if ! groups $USER | grep -q docker; then
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Usuário adicionado ao grupo docker${NC}"
fi

# 4. Criar diretório
sudo mkdir -p "$APP_DIR"
sudo chown -R $USER:$USER "$APP_DIR"
echo -e "${GREEN}✅ Diretório $APP_DIR criado${NC}"

# 5. Configurar firewall
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
    echo -e "${GREEN}✅ Firewall configurado${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Servidor preparado!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}🔄 Próximo passo:${NC}"
echo "O GitHub Actions vai clonar o repositório e fazer deploy"
echo "automaticamente no próximo push para a branch main"
echo ""
echo -e "${YELLOW}📋 Teste manualmente se quiser:${NC}"
echo "cd $APP_DIR"
echo "git clone https://github.com/graziele-nansen/CEMIG-AMI-Network-Monitoring.git ."
echo "docker compose up -d --build"
