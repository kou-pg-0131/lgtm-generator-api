resource "aws_s3_bucket" "lgtms" {
  bucket        = "${local.prefix}-lgtms"
  acl           = "private"
  force_destroy = var.stage != "prod"

  versioning {
    enabled = true
  }

  lifecycle_rule {
    prefix  = "/"
    enabled = true
    noncurrent_version_expiration {
      days = 60
    }
  }

  tags = { Name = "${local.prefix}-lgtms" }
}

resource "aws_s3_bucket_policy" "lgtms" {
  bucket = aws_s3_bucket.lgtms.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.lgtms.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "arn:aws:s3:::${aws_s3_bucket.lgtms.id}/*"
      }
    ]
  })
}
