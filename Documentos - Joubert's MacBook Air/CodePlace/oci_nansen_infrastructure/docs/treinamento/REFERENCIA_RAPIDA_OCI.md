# Referência Rápida - Comandos OCI Essenciais

## OCI CLI - Comandos Principais

### Autenticação e Configuração
```bash
# Verificar configuração
oci setup config

# Testar autenticação
oci iam user get --user-id $OCI_USER_ID

# Listar regiões
oci iam region list
```

### Compute (Instâncias)
```bash
# Listar instâncias
oci compute instance list --compartment-id $COMPARTMENT_ID

# Detalhes de uma instância
oci compute instance get --instance-id $INSTANCE_ID

# Iniciar instância
oci compute instance action --action START --instance-id $INSTANCE_ID

# Parar instância
oci compute instance action --action STOP --instance-id $INSTANCE_ID
```

### Networking (Rede)
```bash
# Listar VCNs
oci network vcn list --compartment-id $COMPARTMENT_ID

# Listar subnets
oci network subnet list --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID
```

### Storage (Armazenamento)
```bash
# Listar buckets
oci os bucket list --compartment-id $COMPARTMENT_ID

# Upload de arquivo
oci os object put --bucket-name my-bucket --file arquivo.txt
```

## Terraform - Comandos Essenciais

### Inicialização e Planejamento
```bash
# Inicializar
terraform init

# Validar
terraform validate

# Criar plano
terraform plan

# Aplicar mudanças
terraform apply
```

### Destruição e Limpeza
```bash
# Plano de destruição
terraform plan -destroy

# Destruir recursos
terraform destroy
```

## Troubleshooting Comum

### Problema: 401-NotAuthenticated
```bash
# Verificar chave privada
openssl rsa -check -in ~/.oci/oci_api_key.pem

# Verificar fingerprint
openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | openssl md5 -c
```

## Links Úteis
- [OCI Documentation](https://docs.oracle.com/en-us/iaas/Content/home.htm)
- [Terraform OCI Provider](https://registry.terraform.io/providers/oracle/oci/latest)
