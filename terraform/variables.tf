variable "stage" {
  type = string
}
variable "ip_whitelist" {
  type = list(string)
}

locals {
  sub_domain   = var.stage == "prod" ? "" : "${var.stage}."
  api_domain   = "${local.sub_domain}api.lgtm-generator.kou-pg.com"
  lgtms_domain = "${local.sub_domain}lgtms.lgtm-generator.kou-pg.com"
  product      = "lgtm-generator-api"
  prefix       = "${local.product}-${var.stage}"
}
