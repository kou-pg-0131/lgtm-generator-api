data aws_route53_zone main {
  name         = "kou-pg.com"
  private_zone = false
}

resource aws_route53_record api_certificate_validation {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = aws_acm_certificate.api.domain_validation_options.*.resource_record_name[0]
  type    = aws_acm_certificate.api.domain_validation_options.*.resource_record_type[0]
  records = [aws_acm_certificate.api.domain_validation_options.*.resource_record_value[0]]
  ttl     = 60
}

resource aws_route53_record api {
  zone_id = data.aws_route53_zone.main.id
  name    = local.api_domain
  type    = "A"

  alias {
    name                   = aws_api_gateway_domain_name.main.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.main.cloudfront_zone_id
    evaluate_target_health = false
  }
}

resource aws_route53_record lgtms_certificate_validation {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = aws_acm_certificate.lgtms.domain_validation_options.*.resource_record_name[0]
  type    = aws_acm_certificate.lgtms.domain_validation_options.*.resource_record_type[0]
  records = [aws_acm_certificate.lgtms.domain_validation_options.*.resource_record_value[0]]
  ttl     = 60
}

resource aws_route53_record lgtms {
  zone_id = data.aws_route53_zone.main.id
  name    = local.lgtms_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.lgtms.domain_name
    zone_id                = aws_cloudfront_distribution.lgtms.hosted_zone_id
    evaluate_target_health = false
  }
}
