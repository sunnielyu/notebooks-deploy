###############################################################################
## Google Cloud config options
#  gcp_cred is a json formated service account secret
gcp_cred = ""
gcp_region = "us-east1"
gcp_project = "ls-compute"

###############################################################################
## SSL Certificate and key paths
ssl_cert = {
  cert = "test"
  key = "test"
}

###############################################################################
## DNS Settings
enable_dns = false
dns_zone = ""
dns_name = ""

###############################################################################
## Google Container Engine (GKE) Options
gke_options = {
  name = "arcts-kube"
  initial_node_count = 3
  preemptible = false
  disk_size_gb = 10
  machine_type = "n1-standard-1"
}