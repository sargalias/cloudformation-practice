data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "defaults" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "lb" {
  name   = "lb"
  vpc_id = data.aws_vpc.default.id
}
resource "aws_vpc_security_group_ingress_rule" "public_http_ingress" {
  security_group_id = aws_security_group.lb.id

  ip_protocol = "tcp"
  from_port   = 80
  to_port     = 80
  cidr_ipv4   = "0.0.0.0/0"
}
resource "aws_vpc_security_group_egress_rule" "egress_to_compute" {
  security_group_id = aws_security_group.lb.id

  ip_protocol                  = "tcp"
  from_port                    = 8080
  to_port                      = 8080
  referenced_security_group_id = aws_security_group.iac_practice_web_app_compute.id
}

resource "aws_security_group" "iac_practice_web_app_compute" {
  name = "iac_practice_compute"
}
resource "aws_vpc_security_group_ingress_rule" "iac_practice_web_app_compute_ingress" {
  security_group_id = aws_security_group.iac_practice_web_app_compute.id

  ip_protocol                  = "tcp"
  from_port                    = 8080
  to_port                      = 8080
  referenced_security_group_id = aws_security_group.lb.id
}
