This project is a sample application composed of 3 parts:

1. RabbitMQ servers
2. An application called `handler`. This applications is in listening to
   [wikipedia event
   stream](https://www.mediawiki.org/wiki/API:Recent_changes_stream) and it's
   sending every new `edit` event to RabbitMQ. The payload of the message is
   `{"link": "https://en.wikipedia.org/w/index.php?diff=123456&oldid=123445"}`.
3. `worker` is elaborating all the messages as follow: It's using PhantomJS to
   take a screen of the page and it's putting that image to AWS S3.

worker and handler are in NodeJS.

This application contains also some dockerfile, compose and stack because it's
built as use case around Docker Swarm and
[orbiter](https://github.com/gianarb/orbiter) made with
[InfluxData](https://influxdata.com).

Here I am listing some command to run all this applications in AWS with Docker
Swarm.

1. Create a new bucket called as you prefer in my case `gianarb.wikidiff.output`
2. Create a NEW AMI to allow aws-cli to store the image in that bucket.
3. Create a security group and you can expose port 8000, 8080 and 2375.

> !! All the configurations showed here are only for development purpose. No
> security or best practices are involved here around how to make your cluster
> secure and so on.

Let's start a 3 node cluster. I started 3 EC2 `t2.medium`, you need to attach
the right security group obviously.

To install Docker in all your node you can do:

```bash
sudo su root
curl https://experimental.docker.com | sh
```

At this point your Docker is very old because AWS is not updating them
registries. I did that:

```bash
wget https://test.docker.com/builds/Linux/x86_64/docker-17.04.0-ce-rc1.tgz
tar xzvf docker-17.04.0-ce-rc1.tgz
sudo mv docker/* /usr/bin/
```
We are just downloaded the last available version of Docker and we replaced the
binaries in our server.

We need to apply some basic configuration to our daemon. To do that we need to
edit `/lib/systemd/system/docker.service`

Replace this line:

```
ExecStart=/usr/bin/dockerd -H fd://
```

With:

```
ExecStart=/usr/bin/dockerd -H fd:// -H "tcp://your-ip" --experimental
```

Pick one of your server and in just one of them you need to add also the label
`--label kind=rabbit`. This server is going to host RabbitMQ.

```
ExecStart=/usr/bin/dockerd -H fd:// --label kind=rabbit -H "tcp://your-ip"
```

All done. You can restart your services and create a cluster.

At this point we need to create an overlay network:

```
docker network create -d overlay int-net
```

And we need to create a secret called `aws-credential`.
```
docker secret create aws-credential ~/.aws/credentials
```
`~/.aws/credentials` is the path that contains the credential created before to
allow  our worker to copy to S3.

That's it let's deploy our stack:

```
docker stack deploy -c ./docker-compose.yml wikidiff
```

You can check if all your services are running with the command:

```
$ docker service ls
ID            NAME              MODE        REPLICAS  IMAGE
919eh3s901r5  wikidiff_worker   replicated  1/1
gianarb/wikidiff-worker:latest
l40y2yaorkmj  wikidiff_handler  replicated  1/1
gianarb/wikidiff-handler:latest
nqwpsdj2s6wz  wikidiff_rabbit   replicated  1/1       rabbitmq:3-management
v106ftygaixx  wikidiff_orbiter  replicated  1/1       gianarb/orbiter:latest

```
Thanks what you need to get back. All the services have a `1/1` task.

You have 2 ports exposed one is `8000` you have the RabbitMQ manager there.
Both password and username are `guest`

You also have [orbiter](https://github.com/gianarb/orbiter) up and running you
can see if it has some service auto-detected from the browser at this page:

```
http://your-ip:8000/autoscaler
```
