# resource "aws_db_instance" "default" {
#   allocated_storage   = 20
#   db_name             = "iac_practice_web_app"
#   engine              = "postgres"
#   username            = "postgres"
#   password            = "postgres"
#   instance_class      = "db.t3.micro"
#   deletion_protection = false
#   skip_final_snapshot = true
# }
