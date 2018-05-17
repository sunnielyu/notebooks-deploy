###############################################################################
##
# DO NOT NORMALLY EDIT THESE FILES
#    see: https://www.terraform.io/docs/configuration/variables.html Variable Files
#
#  See example.tfvars
#
#  Put all options in .tfvars eg:
#    terraform plan -var-file=rajrao.tfvars

###############################################################################
## Google Cloud Options

variable "gcp_cred" {
  description = "Cred secret for GCP API"
  default     = "ls-compute-creds.json"
}

variable "gcp_region" {
  description = "The region to place the cluster"
  default     = "us-east1"
}

variable "gcp_project" {
  description = "Google Project to invoke under"
  default     = "ls-compute"
}

###############################################################################
## DNS Setup
variable "enable_dns" {
  default = false
}

//variable "dns_zone" {
//  description = "managed DNS zone, as named in cloud provider"
//  default     = "gcp-arcts-zone"
//}
//
//variable "dns_name" {
//  description = "FQDN including trailing . (for google) to use for service"
//  default     = "j-test.labshare.org."
//}
//
//###############################################################################
//## SSL Configuration
//variable "ssl_cert" {
//  type        = "map"
//  description = "ssl certificate keys used by proxy"
//}

###############################################################################
##
#  google container engine configs
variable "gke_options" {
  type        = "map"
  description = "global options for gke/kubernetes"

  default = {
    name               = "arcts-kube"
    initial_node_count = 3

    #zone = ""   # if not defined takes first from data "google_compute_zones" "available" {}
    preemptible  = false
    disk_size_gb = 10              # size in GB, 10 is minimum value
    machine_type = "n1-standard-1"
  }
}
