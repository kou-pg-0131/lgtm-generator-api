resource aws_acm_certificate api {
  domain_name       = local.api_domain
  validation_method = "DNS"
  tags              = { Name = "${local.prefix}-api" }
}

resource aws_acm_certificate lgtms {
  domain_name       = local.lgtms_domain
  validation_method = "DNS"
  tags              = { Name = "${local.prefix}-lgtms" }
}
