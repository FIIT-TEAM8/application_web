#!/bin/bash

echo "Enter path to dev environment variables (eg. '../dev_environment/service_config/env/'):"

dest_path="./dev/env"
read env_path

mkdir -p $dest_path && find $env_path -name \*.env -exec cp {} $dest_path \; && echo "Environment variables copied from ${env_path} to ${dest_path}"
