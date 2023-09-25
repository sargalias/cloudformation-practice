import aws_cdk as core
import aws_cdk.assertions as assertions

from workshop_3.workshop_3_stack import Workshop3Stack

# example tests. To run these tests, uncomment this file along with the example
# resource in workshop_3/workshop_3_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = Workshop3Stack(app, "workshop-3")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
