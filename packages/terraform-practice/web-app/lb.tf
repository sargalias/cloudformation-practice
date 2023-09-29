resource "aws_lb" "iac_practice_web_app" {
  name               = "iac-practice-lb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = data.aws_subnets.defaults.ids
}

resource "aws_lb_listener" "iac_practice_web_app" {
  load_balancer_arn = aws_lb.iac_practice_web_app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.iac_practice_web_app.arn
  }
}

resource "aws_lb_listener_rule" "iac_practice_web_app" {
  listener_arn = aws_lb_listener.iac_practice_web_app.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.iac_practice_web_app.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

resource "aws_lb_target_group" "iac_practice_web_app" {
  name     = "iac-practice-web-app"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
}

resource "aws_lb_target_group_attachment" "iac_practice_web_app" {
  count            = var.instance_count
  target_group_arn = aws_lb_target_group.iac_practice_web_app.arn
  target_id        = aws_instance.instance[count.index].id
}
