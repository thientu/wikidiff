#!/bin/bash
docker-machine create --amazonec2-region eu-west-1 \
    --amazonec2-security-group super-secure --amazonec2-vpc-id vpc-a6f179c2 \
    --amazonec2-subnet-id subnet-b2aad3ea --amazonec2-zone b \
    --engine-install-url https://test.docker.com/ \
    --amazonec2-instance-type t2.medium \
    --engine-opt experimental=true \
    --driver amazonec2 s1
docker-machine ssh s1 'sudo docker swarm init'

TOKEN=$(docker-machine ssh s1 'sudo docker swarm join-token -q worker')

docker-machine create --amazonec2-region eu-west-1 \
    --amazonec2-security-group super-secure --amazonec2-vpc-id vpc-a6f179c2 \
    --amazonec2-subnet-id subnet-b2aad3ea --amazonec2-zone b \
    --amazonec2-instance-type t2.medium \
    --engine-install-url https://test.docker.com/ \
    --engine-label kind=rabbit \
    --engine-opt experimental=true \
    --driver amazonec2 rabbit && docker-machine ssh rabbit "sudo docker swarm join --token ${TOKEN} $(docker-machine ip s1):2377"

docker-machine create --amazonec2-region eu-west-1 \
    --amazonec2-security-group super-secure --amazonec2-vpc-id vpc-a6f179c2 \
    --amazonec2-subnet-id subnet-b2aad3ea --amazonec2-zone b \
    --amazonec2-instance-type t2.medium \
    --engine-install-url https://test.docker.com/ \
    --engine-label rabbit \
    --engine-opt experimental=true \
    --driver amazonec2 rabbit && docker-machine ssh rabbit "sudo docker swarm join --token ${TOKEN} $(docker-machine ip s1):2377"

docker-machine create --amazonec2-region eu-west-1 \
    --amazonec2-security-group super-secure --amazonec2-vpc-id vpc-a6f179c2 \
    --amazonec2-subnet-id subnet-b2aad3ea --amazonec2-zone b \
    --amazonec2-instance-type t2.medium \
    --engine-install-url https://test.docker.com/ \
    --engine-opt experimental=true \
    --driver amazonec2 s2 && docker-machine ssh s2 "sudo docker swarm join --token ${TOKEN} $(docker-machine ip s1):2377"
