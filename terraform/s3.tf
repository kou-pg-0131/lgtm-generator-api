resource aws_s3_bucket lgtms {
  bucket        = "${var.stage == "prod" ? local.product : local.prefix}-lgtms"
  acl           = "public-read"
  force_destroy = true

  versioning {
    enabled = true
  }

  tags = { Name = "${local.prefix}-lgtms" }
}

resource aws_s3_bucket_policy lgtms {
  bucket = aws_s3_bucket.lgtms.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Condition = length(var.ip_whitelist) == 0 ? {} : {
          IpAddress = {
            "aws:SourceIp" = var.ip_whitelist
          }
        }
        Resource = "arn:aws:s3:::${aws_s3_bucket.lgtms.id}/*"
      }
    ]
  })
}
