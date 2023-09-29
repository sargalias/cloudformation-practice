# resource "aws_route53_zone" "primary" {
#   name = "example.com"
# }

# resource "aws_route53_record" "lb" {
#   zone_id = aws_route53_zone.primary.id
#   name    = "example.com"
#   type    = "A"

#   alias {
#     name                   = aws_lb.iac_practice_web_app.dns_name
#     zone_id                = aws_lb.iac_practice_web_app.zone_id
#     evaluate_target_health = true
#   }
# }
