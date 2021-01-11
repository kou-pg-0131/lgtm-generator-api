provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

module "main" {
  source = "../.."

  stage        = var.stage
  ip_whitelist = var.ip_whitelist
}

variable "ip_whitelist" {
  type    = list(string)
  default = []
}
