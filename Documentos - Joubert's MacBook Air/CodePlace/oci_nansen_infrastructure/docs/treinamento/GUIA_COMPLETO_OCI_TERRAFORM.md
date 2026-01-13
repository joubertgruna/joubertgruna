# 🚀 Guia Completo: Terraform com Oracle Cloud Infrastructure (OCI)

## 📋 Índice

1. [Pré-requisitos](#1-pré-requisitos)
2. [Configurar Acesso à OCI](#2-configurar-acesso-à-oci)
3. [Instalar Terraform](#3-instalar-terraform)
4. [Estrutura do Projeto](#4-estrutura-do-projeto)
5. [Criar Recursos na OCI](#5-criar-recursos-na-oci)
6. [Atualizar Recursos](#6-atualizar-recursos)
7. [Deletar Recursos](#7-deletar-recursos)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Pré-requisitos

### ✅ O que você precisa:

- [ ] Conta na Oracle Cloud Infrastructure (OCI)
- [ ] Acesso administrativo ou permissões adequadas
- [ ] Terminal (macOS Terminal, Windows PowerShell, ou Linux Shell)
- [ ] Editor de texto (VS Code recomendado)

---

## 2. Configurar Acesso à OCI

### 🔐 Passo 2.1: Obter Credenciais OCI

#### A. Fazer Login no Console OCI
1. Acesse: https://cloud.oracle.com/
2. Faça login com suas credenciais
3. Anote a **região** que você está usando (ex: `us-ashburn-1`)

#### B. Obter OCIDs Necessários

##### **Tenancy OCID** (ID do seu tenant/organização)
1. No console OCI, clique no **menu hambúrguer** (☰) no canto superior esquerdo
2. Navegue até: **Governance & Administration** → **Tenancy Details**
3. Copie o **OCID** (começa com `ocid1.tenancy.oc1...`)
4. Salve como: `TENANCY_OCID`

##### **User OCID** (ID do seu usuário)
1. Clique no **ícone de perfil** no canto superior direito
2. Clique em **User Settings** (ou seu nome de usuário)
3. Copie o **OCID** (começa com `ocid1.user.oc1...`)
4. Salve como: `USER_OCID`

##### **Compartment OCID** (onde os recursos serão criados)
1. Menu hambúrguer → **Identity & Security** → **Compartments**
2. Clique no compartment desejado (ou use o root compartment)
3. Copie o **OCID** (começa com `ocid1.compartment.oc1...`)
4. Salve como: `COMPARTMENT_OCID`

---

### 🔑 Passo 2.2: Criar Chave API

#### A. Gerar Par de Chaves (Pública/Privada)

**No macOS/Linux:**
```bash
# Criar diretório para as chaves
mkdir -p ~/.oci
cd ~/.oci

# Gerar chave privada
openssl genrsa -out oci_api_key.pem 2048

# Gerar chave pública
openssl rsa -pubout -in oci_api_key.pem -out oci_api_key_public.pem

# Ajustar permissões (importante!)
chmod 600 oci_api_key.pem
chmod 644 oci_api_key_public.pem

# Ver o conteúdo da chave pública (você vai precisar)
cat oci_api_key_public.pem
```

**No Windows (PowerShell):**
```powershell
# Criar diretório
New-Item -Path "$env:USERPROFILE\.oci" -ItemType Directory -Force
cd $env:USERPROFILE\.oci

# Usar OpenSSL (instale se necessário: https://slproweb.com/products/Win32OpenSSL.html)
openssl genrsa -out oci_api_key.pem 2048
openssl rsa -pubout -in oci_api_key.pem -out oci_api_key_public.pem

# Ver chave pública
Get-Content oci_api_key_public.pem
```

#### B. Adicionar Chave Pública ao OCI

1. Volte ao console OCI
2. Clique no **ícone de perfil** → **User Settings**
3. Na seção **Resources** (lado esquerdo), clique em **API Keys**
4. Clique em **Add API Key**
5. Selecione **Paste Public Key**
6. Cole o conteúdo completo do arquivo `oci_api_key_public.pem`
7. Clique em **Add**

#### C. Obter Fingerprint

Após adicionar a chave, você verá o **Fingerprint** (ex: `aa:bb:cc:dd:ee:ff:...`)
- Copie e salve como: `KEY_FINGERPRINT`

---

### 📝 Passo 2.3: Criar Arquivo de Configuração OCI

Crie o arquivo de configuração padrão da OCI CLI:

**macOS/Linux:**
```bash
# Criar arquivo de configuração
nano ~/.oci/config
```

**Windows:**
```powershell
notepad $env:USERPROFILE\.oci\config
```

**Conteúdo do arquivo `config`:**
```ini
[DEFAULT]
user=ocid1.user.oc1..aaaaaaaa...seu_user_ocid...
fingerprint=aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99
tenancy=ocid1.tenancy.oc1..aaaaaaaa...seu_tenancy_ocid...
region=us-ashburn-1
key_file=~/.oci/oci_api_key.pem
```

**Substitua:**
- `user=` → Seu USER_OCID
- `fingerprint=` → Seu KEY_FINGERPRINT
- `tenancy=` → Seu TENANCY_OCID
- `region=` → Sua região (ex: us-ashburn-1, us-phoenix-1, sa-saopaulo-1)
- `key_file=` → Caminho completo para sua chave privada

**No Windows, use caminho Windows:**
```ini
key_file=C:\Users\SeuUsuario\.oci\oci_api_key.pem
```

---

### ✅ Passo 2.4: Testar Conexão (Opcional)

#### A. Instalar OCI CLI (Recomendado para testes)

**macOS:**
```bash
brew install oci-cli
```

**Linux:**
```bash
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"
```

**Windows:**
```powershell
# Baixar e executar o instalador MSI
# https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/climanualinst.htm
```

#### B. Testar Conectividade

```bash
# Listar compartments (deve funcionar se tudo estiver configurado)
oci iam compartment list --all

# Listar regiões disponíveis
oci iam region list
```

Se funcionar, você está pronto para usar o Terraform! 🎉

---

## 3. Instalar Terraform

### 📦 Passo 3.1: Baixar e Instalar Terraform

**macOS (Homebrew):**
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

**Linux (Ubuntu/Debian):**
```bash
# Adicionar repositório HashiCorp
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

# Instalar
sudo apt update && sudo apt install terraform
```

**Windows (Chocolatey):**
```powershell
choco install terraform
```

**Ou baixe manualmente:**
- https://www.terraform.io/downloads

### ✅ Passo 3.2: Verificar Instalação

```bash
terraform version
# Deve mostrar: Terraform v1.x.x
```

---

## 4. Estrutura do Projeto

### 📁 Passo 4.1: Organizar Diretórios

```bash
# Navegar até seu projeto
cd ~/CodePlace/oci_nansen_infrastructure

# Estrutura típica:
# OCINonProdTherraform/  ← Ambiente de Não-Produção
# OCIProdTherraform/     ← Ambiente de Produção
```

### 📄 Passo 4.2: Arquivos Essenciais

#### **1. `providers.tf` - Configuração do Provider OCI**

```hcl
# providers.tf

terraform {
  required_version = ">= 1.0"

  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
  }
}

provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}
```

#### **2. `variables.tf` - Definição de Variáveis**

```hcl
# variables.tf

# Credenciais OCI
variable "tenancy_ocid" {
  description = "OCID do Tenancy"
  type        = string
}

variable "user_ocid" {
  description = "OCID do Usuário"
  type        = string
}

variable "fingerprint" {
  description = "Fingerprint da chave API"
  type        = string
}

variable "private_key_path" {
  description = "Caminho para chave privada OCI"
  type        = string
  default     = "~/.oci/oci_api_key.pem"
}

variable "region" {
  description = "Região OCI"
  type        = string
  default     = "us-ashburn-1"
}

variable "compartment_ocid" {
  description = "OCID do Compartment onde recursos serão criados"
  type        = string
}

# Configurações de Recursos
variable "environment" {
  description = "Ambiente (dev, nonprod, prod)"
  type        = string
  default     = "nonprod"
}
```

#### **3. `terraform.tfvars` - Valores das Variáveis**

⚠️ **IMPORTANTE: Nunca commite este arquivo no Git!**

```hcl
# terraform.tfvars (ou terraform_prod.tfvars)

# Credenciais OCI
tenancy_ocid     = "ocid1.tenancy.oc1..aaaaaaaa...seu_tenancy_ocid..."
user_ocid        = "ocid1.user.oc1..aaaaaaaa...seu_user_ocid..."
fingerprint      = "aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99"
private_key_path = "~/.oci/oci_api_key.pem"
region           = "us-ashburn-1"

# Compartment
compartment_ocid = "ocid1.compartment.oc1..aaaaaaaa...seu_compartment_ocid..."

# Ambiente
environment = "prod"
```

#### **4. `.gitignore` - Proteger Informações Sensíveis**

```gitignore
# .gitignore

# Terraform
*.tfstate
*.tfstate.*
*.tfvars
.terraform/
.terraform.lock.hcl
terraform.tfplan
crash.log
override.tf
override.tf.json

# Chaves OCI
*.pem
*.ppk
.oci/

# Backups
*.backup
```

---

## 5. Criar Recursos na OCI

### 🎯 Exemplo Completo: Criar uma Instância (VM)

#### **Passo 5.1: Criar Arquivo de Instância**

Crie o arquivo `instances.tf`:

```hcl
# instances.tf

# Obter imagem Ubuntu mais recente
data "oci_core_images" "ubuntu" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                    = "VM.Standard.E4.Flex"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

# Obter VCN padrão ou criar uma
data "oci_core_vcns" "existing_vcns" {
  compartment_id = var.compartment_ocid
}

# Criar Instância
resource "oci_core_instance" "exemplo_vm" {
  # Identificação
  display_name        = "vm-${var.environment}-exemplo-01"
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name

  # Shape (tipo de instância)
  shape = "VM.Standard.E4.Flex"
  shape_config {
    ocpus         = 1
    memory_in_gbs = 8
  }

  # Imagem do sistema operacional
  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ubuntu.images[0].id
  }

  # Rede
  create_vnic_details {
    subnet_id        = data.oci_core_subnets.existing_subnets.subnets[0].id
    assign_public_ip = true
    hostname_label   = "vm-exemplo-01"
  }

  # Chave SSH para acesso
  metadata = {
    ssh_authorized_keys = file("~/.ssh/id_rsa.pub")
    user_data          = base64encode(file("${path.module}/cloud-init.yaml"))
  }

  # Tags
  freeform_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    CreatedBy   = "Terraform"
  }
}

# Dados necessários
data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

data "oci_core_subnets" "existing_subnets" {
  compartment_id = var.compartment_ocid
  vcn_id         = data.oci_core_vcns.existing_vcns.virtual_networks[0].id
}
```

#### **Passo 5.2: Criar VCN e Subnet (se necessário)**

```hcl
# network.tf

# Criar VCN (Virtual Cloud Network)
resource "oci_core_vcn" "exemplo_vcn" {
  compartment_id = var.compartment_ocid
  cidr_blocks    = ["10.0.0.0/16"]
  display_name   = "vcn-${var.environment}-exemplo"
  dns_label      = "vcnexemplo"

  freeform_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Criar Internet Gateway
resource "oci_core_internet_gateway" "exemplo_ig" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.exemplo_vcn.id
  display_name   = "ig-${var.environment}-exemplo"
  enabled        = true
}

# Criar Route Table
resource "oci_core_route_table" "exemplo_rt" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.exemplo_vcn.id
  display_name   = "rt-${var.environment}-exemplo"

  route_rules {
    destination       = "0.0.0.0/0"
    network_entity_id = oci_core_internet_gateway.exemplo_ig.id
  }
}

# Criar Security List
resource "oci_core_security_list" "exemplo_sl" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.exemplo_vcn.id
  display_name   = "sl-${var.environment}-exemplo"

  # Regras de Ingress (entrada)
  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"

    tcp_options {
      min = 22
      max = 22
    }
    description = "SSH"
  }

  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"

    tcp_options {
      min = 80
      max = 80
    }
    description = "HTTP"
  }

  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"

    tcp_options {
      min = 443
      max = 443
    }
    description = "HTTPS"
  }

  # Regras de Egress (saída)
  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
    description = "Allow all outbound"
  }
}

# Criar Subnet
resource "oci_core_subnet" "exemplo_subnet" {
  compartment_id      = var.compartment_ocid
  vcn_id              = oci_core_vcn.exemplo_vcn.id
  cidr_block          = "10.0.1.0/24"
  display_name        = "subnet-${var.environment}-exemplo"
  dns_label           = "subnetexemplo"
  route_table_id      = oci_core_route_table.exemplo_rt.id
  security_list_ids   = [oci_core_security_list.exemplo_sl.id]
  prohibit_public_ip_on_vnic = false
}
```

#### **Passo 5.3: Criar Outputs**

```hcl
# outputs.tf

output "instance_public_ip" {
  description = "IP público da instância"
  value       = oci_core_instance.exemplo_vm.public_ip
}

output "instance_private_ip" {
  description = "IP privado da instância"
  value       = oci_core_instance.exemplo_vm.private_ip
}

output "instance_id" {
  description = "OCID da instância"
  value       = oci_core_instance.exemplo_vm.id
}

output "ssh_command" {
  description = "Comando para conectar via SSH"
  value       = "ssh ubuntu@${oci_core_instance.exemplo_vm.public_ip}"
}
```

---

### 🚀 Passo 5.4: Executar Terraform

```bash
# 1. Navegar até o diretório
cd OCINonProdTherraform/

# 2. Inicializar Terraform (primeira vez)
terraform init

# O que acontece:
# - Baixa o provider OCI
# - Cria diretório .terraform/
# - Prepara backend

# 3. Validar sintaxe
terraform validate

# 4. Formatar código (opcional)
terraform fmt

# 5. Planejar mudanças
terraform plan

# O que você verá:
# - Lista de recursos que serão criados (+)
# - Detalhes de cada recurso
# - Resumo: "Plan: X to add, 0 to change, 0 to destroy"

# 6. Revisar o plano cuidadosamente!

# 7. Aplicar mudanças
terraform apply

# Você verá:
# - O mesmo plano novamente
# - Prompt: "Do you want to perform these actions?"
# - Digite: yes

# 8. Aguardar criação (pode levar 3-5 minutos)

# 9. Ver outputs
terraform output

# Exemplo de output:
# instance_public_ip = "xxx.xxx.xxx.xxx"
# ssh_command = "ssh ubuntu@xxx.xxx.xxx.xxx"
```

---

### 🔍 Passo 5.5: Verificar Recursos Criados

#### Via Terraform:
```bash
# Listar todos os recursos gerenciados
terraform state list

# Ver detalhes de um recurso específico
terraform state show oci_core_instance.exemplo_vm

# Ver outputs
terraform output
terraform output instance_public_ip
```

#### Via Console OCI:
1. Login no console: https://cloud.oracle.com/
2. Menu → **Compute** → **Instances**
3. Você deve ver sua VM: `vm-nonprod-exemplo-01`

---

## 6. Atualizar Recursos

### 🔄 Cenários Comuns de Atualização

#### **Cenário 1: Mudar Shape (Tipo de Instância)**

```hcl
# instances.tf

resource "oci_core_instance" "exemplo_vm" {
  # ... outras configurações ...

  # ANTES:
  # shape = "VM.Standard.E4.Flex"
  # shape_config {
  #   ocpus         = 1
  #   memory_in_gbs = 8
  # }

  # DEPOIS (mais potente):
  shape = "VM.Standard.E4.Flex"
  shape_config {
    ocpus         = 2  # ← Aumentado
    memory_in_gbs = 16 # ← Aumentado
  }
}
```

```bash
# Aplicar mudança
terraform plan   # Ver o que mudará
terraform apply  # Aplicar (instância será reiniciada)
```

#### **Cenário 2: Adicionar Block Volume (Disco)**

```hcl
# storage.tf (criar novo arquivo)

resource "oci_core_volume" "exemplo_volume" {
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = "volume-${var.environment}-dados-01"
  size_in_gbs         = 100

  freeform_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "oci_core_volume_attachment" "exemplo_attachment" {
  attachment_type = "paravirtualized"
  instance_id     = oci_core_instance.exemplo_vm.id
  volume_id       = oci_core_volume.exemplo_volume.id
  display_name    = "attachment-dados-01"
}
```

```bash
terraform apply
```

#### **Cenário 3: Atualizar Security List (Adicionar Porta)**

```hcl
# network.tf

resource "oci_core_security_list" "exemplo_sl" {
  # ... configurações existentes ...

  # ADICIONAR nova regra:
  ingress_security_rules {
    protocol = "6" # TCP
    source   = "0.0.0.0/0"

    tcp_options {
      min = 8080
      max = 8080
    }
    description = "Aplicação Web"
  }
}
```

```bash
terraform apply  # Mudança será aplicada sem reiniciar instância
```

---

### ⚙️ Comandos de Atualização

```bash
# 1. Editar arquivos .tf conforme necessário

# 2. Ver diferenças
terraform plan

# Output mostrará:
# ~ recurso será modificado (in-place)
# -/+ recurso será destruído e recriado
# + novo recurso será criado
# - recurso será removido

# 3. Aplicar mudanças
terraform apply

# 4. Verificar estado
terraform show

# 5. Ver recurso específico
terraform state show oci_core_instance.exemplo_vm
```

---

## 7. Deletar Recursos

### 🗑️ Opção 1: Deletar Recurso Específico

```bash
# Deletar instância específica
terraform destroy -target=oci_core_instance.exemplo_vm

# Deletar volume específico
terraform destroy -target=oci_core_volume.exemplo_volume

# Deletar múltiplos recursos
terraform destroy \
  -target=oci_core_instance.exemplo_vm \
  -target=oci_core_volume.exemplo_volume
```

### 🗑️ Opção 2: Remover do Código

```bash
# 1. Comentar ou deletar recurso do arquivo .tf
# 2. Executar:
terraform plan   # Mostrará que recurso será destruído (-)
terraform apply  # Confirme com 'yes'
```

### 🗑️ Opção 3: Destruir TUDO

⚠️ **CUIDADO EXTREMO!**

```bash
# Destruir TODA a infraestrutura gerenciada
terraform destroy

# Terraform mostrará tudo que será deletado
# Digite 'yes' para confirmar

# Alternativa: aprovar automaticamente (use com cuidado!)
terraform destroy -auto-approve
```

### 🛡️ Proteger Recursos Críticos

```hcl
# instances.tf

resource "oci_core_instance" "exemplo_vm_producao" {
  # ... configurações ...

  # Prevenir destruição acidental
  lifecycle {
    prevent_destroy = true
  }
}
```

Agora, se tentar `terraform destroy`, você receberá erro protegendo o recurso.

---

## 8. Troubleshooting

### ❌ Erro: "Error: 401-NotAuthenticated"

**Causa:** Credenciais OCI incorretas

**Solução:**
```bash
# 1. Verificar arquivo de configuração
cat ~/.oci/config

# 2. Verificar permissões da chave
ls -la ~/.oci/oci_api_key.pem
# Deve mostrar: -rw------- (600)

# 3. Corrigir permissões se necessário
chmod 600 ~/.oci/oci_api_key.pem

# 4. Verificar fingerprint no console OCI
# User Settings → API Keys
```

---

### ❌ Erro: "Error: 404-NotAuthorizedOrNotFound"

**Causa:** Permissões IAM insuficientes ou OCID incorreto

**Solução:**
```bash
# 1. Verificar OCID do compartment
terraform console
> var.compartment_ocid

# 2. Verificar permissões IAM no console OCI
# Identity → Policies
# Seu usuário precisa de:
# - manage instance-family in compartment <nome>
# - manage virtual-network-family in compartment <nome>
```

---

### ❌ Erro: "Error acquiring the state lock"

**Causa:** Processo anterior não finalizou corretamente

**Solução:**
```bash
# Forçar desbloqueio (use com cuidado!)
terraform force-unlock <LOCK_ID>

# O LOCK_ID é mostrado na mensagem de erro
```

---

### ❌ Erro: "Error: Invalid provider configuration"

**Causa:** Provider não inicializado

**Solução:**
```bash
# Reinicializar Terraform
terraform init -upgrade
```

---

### ❌ Erro: "No available image"

**Causa:** Image não encontrada para o shape especificado

**Solução:**
```bash
# Listar imagens disponíveis
oci compute image list \
  --compartment-id <compartment_ocid> \
  --operating-system "Canonical Ubuntu"

# Ou ajustar data source no Terraform
```

---

### 🔍 Debugging Avançado

```bash
# Ativar logs detalhados
export TF_LOG=DEBUG
terraform plan

# Salvar logs em arquivo
export TF_LOG_PATH=./terraform.log
terraform apply

# Ver estado JSON completo
terraform show -json | jq

# Importar recurso existente no Terraform
terraform import oci_core_instance.exemplo_vm ocid1.instance.oc1...
```

---

## 📚 Recursos e Exemplos Adicionais

### 🗄️ Criar Banco de Dados (Autonomous Database)

```hcl
# database.tf

resource "oci_database_autonomous_database" "exemplo_adb" {
  compartment_id           = var.compartment_ocid
  db_name                  = "EXEMPLOATP"
  display_name             = "adb-${var.environment}-exemplo"
  admin_password           = var.db_admin_password # Use variável sensível!
  db_workload              = "OLTP"
  cpu_core_count           = 1
  data_storage_size_in_tbs = 1
  is_auto_scaling_enabled  = true
  is_free_tier             = false # true para Free Tier
  license_model            = "LICENSE_INCLUDED"

  freeform_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
```

### 🪣 Criar Object Storage Bucket

```hcl
# buckets.tf

resource "oci_objectstorage_bucket" "exemplo_bucket" {
  compartment_id = var.compartment_ocid
  namespace      = data.oci_objectstorage_namespace.ns.namespace
  name           = "bucket-${var.environment}-arquivos"
  access_type    = "NoPublicAccess" # ou "ObjectRead" para público

  versioning     = "Enabled"

  freeform_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

data "oci_objectstorage_namespace" "ns" {
  compartment_id = var.compartment_ocid
}
```

### 🗂️ Criar Compartment

```hcl
# compartments.tf

resource "oci_identity_compartment" "exemplo_compartment" {
  compartment_id = var.tenancy_ocid # Parent compartment
  name           = "compartment-${var.environment}"
  description    = "Compartment gerenciado pelo Terraform - ${var.environment}"
  enable_delete  = true # Permite deleção (cuidado em produção!)

  freeform_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
```

### 🔐 Criar Política IAM

```hcl
# iam_policies.tf

resource "oci_identity_policy" "exemplo_policy" {
  compartment_id = var.compartment_ocid
  name           = "policy-${var.environment}-exemplo"
  description    = "Política de exemplo gerenciada pelo Terraform"

  statements = [
    "Allow group Developers to manage instance-family in compartment ${oci_identity_compartment.exemplo_compartment.name}",
    "Allow group Developers to read virtual-network-family in compartment ${oci_identity_compartment.exemplo_compartment.name}",
    "Allow group Developers to manage object-family in compartment ${oci_identity_compartment.exemplo_compartment.name}",
  ]

  freeform_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
```

---

## 🎯 Workflow Recomendado

### Para Mudanças em PRODUÇÃO:

```bash
# 1. Testar em NonProd primeiro
cd OCINonProdTherraform/
terraform plan
terraform apply

# 2. Validar funcionamento em NonProd
# 3. Replicar mudanças para Prod

cd ../OCIProdTherraform/
terraform plan > plan_output.txt

# 4. Revisar plano cuidadosamente
cat plan_output.txt

# 5. Aplicar em horário de manutenção
terraform apply

# 6. Monitorar console OCI
# 7. Fazer backup do state
cp terraform.tfstate terraform.tfstate.backup-$(date +%Y%m%d-%H%M%S)
```

---

## 📝 Checklist de Segurança

- [ ] Arquivo `.gitignore` configurado
- [ ] `terraform.tfvars` NÃO commitado no Git
- [ ] Chaves API com permissões mínimas necessárias
- [ ] `terraform.tfstate` protegido (usar remote backend em produção)
- [ ] Senhas armazenadas como variáveis sensíveis
- [ ] Security Lists com regras restritivas
- [ ] Recursos críticos com `lifecycle { prevent_destroy = true }`
- [ ] Backups habilitados para dados importantes
- [ ] Tags aplicadas a todos os recursos
- [ ] Revisão de código antes de aplicar em produção

---

## 🚀 Próximos Passos

1. **Começar com recursos simples** (VCN, Security Lists)
2. **Adicionar instâncias** conforme necessidade
3. **Implementar remote backend** (OCI Object Storage ou S3)
4. **Criar módulos** para reutilização de código
5. **Implementar CI/CD** com Terraform Cloud ou GitLab CI
6. **Adicionar testes** com Terratest

---

## 📞 Suporte e Documentação

- **Terraform OCI Provider:** https://registry.terraform.io/providers/oracle/oci/latest/docs
- **OCI Documentation:** https://docs.oracle.com/en-us/iaas/
- **Terraform Docs:** https://www.terraform.io/docs
- **OCI CLI Reference:** https://docs.oracle.com/en-us/iaas/tools/oci-cli/latest/

---

**Criado em:** 12 de janeiro de 2026
**Autor:** Guia Completo OCI + Terraform
**Versão:** 1.0

✅ **Você agora tem tudo para começar a usar Terraform com OCI!**
