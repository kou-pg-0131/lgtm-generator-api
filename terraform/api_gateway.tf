data aws_api_gateway_rest_api main {
  name = local.prefix
}

resource aws_api_gateway_domain_name main {
  certificate_arn = aws_acm_certificate_validation.api.certificate_arn
  domain_name     = local.api_domain
}

resource aws_api_gateway_base_path_mapping main {
  api_id      = data.aws_api_gateway_rest_api.main.id
  stage_name  = var.stage
  domain_name = aws_api_gateway_domain_name.main.domain_name
}
