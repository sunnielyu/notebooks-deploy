//resource "aws_s3_bucket" "jupyter" {
//  bucket = "${var.s3-bucket}"
//
//  tags {
//    Name = "jupyter"
//  }
//}

//data template_file "s3-conf" {
//  template = "${file("${path.module}/s3-conf.json.tpl")}"
//  vars {
//    S3_BUCKET = "${var.s3-bucket}"
//  }
//}

resource "aws_efs_file_system" "efs-volume" {
  creation_token = "jupyter"
  performance_mode = "generalPurpose"

  tags {
    Name = "jupyter"
  }
}
resource "aws_efs_mount_target" "mount-target" {
  file_system_id = "${aws_efs_file_system.efs-volume.id}"
  subnet_id = "${var.subnet-id}"
  security_groups = ["${var.emr-master-sg}", "${var.emr-slave-sg}"]
}
//data template_file "bootstrap-conf" {
//  template = "${file("${path.module}/bootstrap.conf")}"
//  vars {
//    EFS_ID = "${aws_efs_file_system.efs-volume.id}"
//  }
//}

resource "aws_emr_cluster" "cluster" {
  name = "emr_cluster"
  release_label = "emr-5.19.0"
  applications = ["JupyterHub"]

  termination_protection = false
  keep_job_flow_alive_when_no_steps = true

  ec2_attributes {
    key_name = "${var.key-name}"
    subnet_id = "${var.subnet-id}"
    emr_managed_master_security_group = "${var.emr-master-sg}"
    emr_managed_slave_security_group  = "${var.emr-slave-sg}"
    instance_profile = "${var.ec2-role}"
  }

  master_instance_type = "m1.large"
  core_instance_type   = "m1.large"
  core_instance_count  = 2

  service_role = "${var.emr-service-role}"

  //configurations_json = "${data.template_file.s3-conf.rendered}"

//  bootstrap_action {
//    name = "mount efs"
//    path = "s3://jupyterhub-emr/bootstrap.conf"
//  }

  depends_on = ["aws_efs_mount_target.mount-target"]

  tags {
    Name = "jupyter"
  }
}