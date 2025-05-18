Retro Chat App
A simple retro-styled chat application that runs on AWS EC2 with Terraform deployment.
Features

Simple retro-styled interface with green text on navy blue background
10 static users to choose from
5 chat rooms: General, Technology, Random, Support, Announcements
Message storage with timestamps
Responsive design for both desktop and mobile
Complete infrastructure as code with Terraform

Deployment
Prerequisites

Terraform installed
AWS account with appropriate permissions
SSH key pair for EC2 instance access

1. Deploy Infrastructure
bash# Create terraform.tfvars with your SSH key
echo 'ssh_public_key = "'$(cat chat-app-key.pub)'"' > terraform.tfvars

# Initialize and apply Terraform
terraform init
terraform apply
2. Deploy Application
bashchmod +x deploy.sh
./deploy.sh $(terraform output -raw instance_public_ip)
Usage

Access the application at http://<EC2_IP>
Select a username from the dropdown
Choose a chat room
Start chatting!

Cleanup
To remove all AWS resources:
bashterraform destroy
