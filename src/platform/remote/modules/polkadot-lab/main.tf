module "polkadot-lab" {
  source = "w3f/polkadot-lab/google"

  cluster_name = var.cluster_name
  machine_type = var.machine_type
  node_count   = var.node_count
}
