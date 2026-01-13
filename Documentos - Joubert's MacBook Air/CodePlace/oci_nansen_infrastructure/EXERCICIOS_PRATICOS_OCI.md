# Exercícios Práticos OCI - Treinamento da Equipe

## Configuração Inicial

### Pré-requisitos
1. Conta OCI ativa
2. OCI CLI instalado e configurado
3. Terraform v1.0+ instalado
4. Chaves API configuradas
5. Acesso ao repositório GitHub do projeto

### Configuração do Ambiente
```bash
# Clonar repositório
git clone https://github.com/joubertgabriel/oci-terraform-infrastructure.git
cd oci-terraform-infrastructure

# Configurar variáveis de ambiente
export TF_VAR_tenancy_ocid="ocid1.tenancy.oc1..aaaa..."
export TF_VAR_user_ocid="ocid1.user.oc1..aaaa..."
export TF_VAR_fingerprint="aa:bb:cc:..."
export TF_VAR_private_key_path="~/.oci/oci_api_key.pem"
export TF_VAR_region="sa-saopaulo-1"
```

## Exercício 1: Criando Virtual Cloud Network (VCN)

### Objetivo
Criar uma VCN com subnets públicas e privadas, incluindo gateways necessários.

### Código Terraform
```hcl
resource "oci_core_virtual_network" "vcn" {
  cidr_block     = var.vcn_cidr_block
  compartment_id = var.compartment_id
  display_name   = var.vcn_display_name
  dns_label      = var.vcn_dns_label
}

resource "oci_core_subnet" "public_subnet" {
  cidr_block                 = var.public_subnet_cidr
  compartment_id             = var.compartment_id
  vcn_id                     = oci_core_virtual_network.vcn.id
  display_name               = "Public Subnet"
  dns_label                  = "public"
  prohibit_public_ip_on_vnic = false
}
```

### Validação
```bash
# Verificar VCN criada
oci network vcn list --compartment-id $TF_VAR_compartment_id
terraform output
```

## Exercício 2: Provisionando Instância Compute

### Objetivo
Criar uma instância VM com acesso SSH.

### Código Terraform
```hcl
resource "oci_core_instance" "web_server" {
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  compartment_id      = var.compartment_id
  shape               = "VM.Standard.E4.Flex"
  shape_config {
    ocpus         = 1
    memory_in_gbs = 16
  }
  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ubuntu_images.images[0].image_id
  }
  create_vnic_details {
    subnet_id                 = oci_core_subnet.public_subnet.id
    assign_public_ip          = true
  }
  display_name = "web-server"
  metadata = {
    ssh_authorized_keys = file(var.ssh_public_key_path)
  }
}
```

### Validação
```bash
# Verificar instância
oci compute instance list --compartment-id $TF_VAR_compartment_id
ssh ubuntu@<public_ip>
```

## Limpeza de Recursos
```bash
terraform destroy -auto-approve
```
