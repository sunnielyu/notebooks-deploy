variable "AWS_REGION" {
  default = "us-east-1"
}
variable "PATH_TO_PUBLIC_KEY" {
  default = "mykey.pub"
}
variable "ECS_INSTANCE_TYPE" {
  default = "m1.large"
}
variable "S3_BUCKET" {
  default = "wipp-jupyterhub"
}