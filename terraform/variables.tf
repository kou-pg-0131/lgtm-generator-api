variable stage {
  type = string
}
variable ip_whitelist {
  type = list(string)
}

locals {
  product = "lgtm-generator-api"
  prefix  = "${local.product}-${var.stage}"
}
