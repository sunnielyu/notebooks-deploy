output "jupyterhub-dns" {
  value = "${module.emr.emr-cluster-dns}:9443"
}