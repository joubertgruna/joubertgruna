# Checklist de Treinamento OCI - Equipe Nansen

## Pré-Treinamento

### Ambiente de Desenvolvimento
- [ ] Instalar OCI CLI
- [ ] Instalar Terraform v1.14+
- [ ] Configurar chaves SSH
- [ ] Gerar chaves API OCI
- [ ] Configurar OCI CLI profile
- [ ] Testar autenticação OCI
- [ ] Clonar repositório do projeto

### Conhecimento Prévio
- [ ] Conceitos básicos de cloud computing
- [ ] Noções de redes (VCN, subnets, security lists)
- [ ] Conceitos de infraestrutura como código
- [ ] Comandos básicos Linux/Unix
- [ ] Version control com Git

## Módulo 1: Fundamentos OCI

### Teoria
- [ ] Entender arquitetura OCI (regiões, ADs, fault domains)
- [ ] Compreender compartments e IAM
- [ ] Conhecer principais serviços OCI
- [ ] Entender cobrança e custos

### Prática
- [ ] Navegar OCI Console
- [ ] Criar compartment de teste
- [ ] Explorar regiões e availability domains

## Módulo 2: Terraform Basics

### Teoria
- [ ] Sintaxe HCL (HashiCorp Configuration Language)
- [ ] Conceitos: providers, resources, data sources
- [ ] State management
- [ ] Variables e outputs

### Prática
- [ ] `terraform init`
- [ ] `terraform validate`
- [ ] `terraform plan`
- [ ] `terraform apply`
- [ ] `terraform destroy`

## Módulo 3: Networking (VCN)

### Teoria
- [ ] Virtual Cloud Networks
- [ ] Subnets (públicas vs privadas)
- [ ] Security Lists e Network Security Groups
- [ ] Gateways (Internet, NAT, Service)
- [ ] Route Tables

### Prática - Exercício 1
- [ ] Criar VCN com CIDR 10.0.0.0/16
- [ ] Criar subnet pública (10.0.1.0/24)
- [ ] Criar subnet privada (10.0.2.0/24)
- [ ] Configurar Internet Gateway
- [ ] Configurar Security Lists
- [ ] Validar configuração

## Módulo 4: Compute (Instâncias)

### Teoria
- [ ] Shapes e tipos de instância
- [ ] Images (Ubuntu, Oracle Linux, Windows)
- [ ] Boot volumes e block volumes
- [ ] VNICs e IPs públicos/privados

### Prática - Exercício 2
- [ ] Provisionar instância Ubuntu 22.04
- [ ] Configurar shape VM.Standard.E4.Flex
- [ ] Atribuir IP público
- [ ] Configurar chave SSH
- [ ] Testar acesso SSH

## Módulo 5: Load Balancing

### Teoria
- [ ] Load Balancers vs Network Load Balancers
- [ ] Backend sets e backends
- [ ] Health checks
- [ ] Listeners e regras

### Prática - Exercício 3
- [ ] Criar Load Balancer
- [ ] Configurar backend set
- [ ] Adicionar instâncias como backends
- [ ] Testar distribuição de carga

## Módulo 6: Database

### Teoria
- [ ] Autonomous Database vs DB Systems
- [ ] Workloads (OLTP, DW, JSON)
- [ ] Licensing models

### Prática - Exercício 4
- [ ] Criar Autonomous Database
- [ ] Configurar credenciais
- [ ] Verificar connection strings

## Módulo 7: Storage

### Teoria
- [ ] Object Storage (buckets, objects)
- [ ] Block Storage (volumes, backups)
- [ ] File Storage
- [ ] Storage tiers

### Prática - Exercício 5
- [ ] Criar bucket Object Storage
- [ ] Upload de arquivos
- [ ] Configurar versioning

## Módulo 8: Identity & Access Management

### Teoria
- [ ] Users, Groups e Dynamic Groups
- [ ] Policies e statements
- [ ] Compartments hierarchy

### Prática - Exercício 6
- [ ] Criar compartments (dev, prod)
- [ ] Criar grupos
- [ ] Criar políticas de acesso
- [ ] Testar permissões

## Pós-Treinamento

### Avaliação
- [ ] Quiz teórico
- [ ] Exercício prático completo
- [ ] Apresentação de solução

### Certificação
- [ ] OCI Architect Associate preparation
- [ ] Terraform Associate certification

## Métricas de Sucesso

### Individuais
- [ ] Completar todos os exercícios
- [ ] Pontuação > 80% no quiz

### Coletivas
- [ ] Todos os membros concluirem
- [ ] Ambiente de laboratório funcional
- [ ] Documentação atualizada

**Data de Início:** __________
**Data de Conclusão:** __________
**Instrutor:** Joubert Gabriel
