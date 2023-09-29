resource "aws_instance" "instance" {
  count         = var.instance_count
  ami           = "ami-0b25f6ba2f4419235"
  instance_type = "t2.micro"

  vpc_security_group_ids = [
    aws_security_group.iac_practice_web_app_compute.id
  ]

  user_data = <<-EOF
              #!/bin/bash
              echo "Hello, World ${count.index}" > index.html
              python3 -m http.server 8080 &
              EOF

  tags = {
    name = "Instance ${count.index}"
  }
}
