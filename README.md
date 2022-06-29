# Workshop: Containers Intro
This repository contains some basic examples you can use to learn about containers and InterSystems IRIS.

Based on: https://github.com/intersystems/Samples-Containers-Bootcamp by Kerry Kirkham

# What do you need to install? 
* [Git](https://git-scm.com/downloads) 
* [Docker](https://www.docker.com/products/docker-desktop) (if you are using Windows, make sure you set your Docker installation to use "Linux containers").
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Visual Studio Code](https://code.visualstudio.com/download) + [InterSystems ObjectScript VSCode Extension](https://marketplace.visualstudio.com/items?itemName=daimor.vscode-objectscript)

# Examples

Have a look at the [Overview. Docker Architecture](https://docs.docker.com/get-started/overview/).  

## Basic container operations

### (a). Creating and running containers
* (a.1) Create and start a new temporary [BusyBox](https://hub.docker.com/_/busybox) container. If you do not have the BusyBox image locally already, Docker will download it first:

```
docker run --rm busybox echo 'hello world'
Unable to find image 'busybox:latest' locally
latest: Pulling from library/busybox
8ec32b265e94: Pull complete 
Digest: sha256:b37dd066f59a4961024cf4bed74cae5e68ac26b48807292bd12198afa3ecb778
Status: Downloaded newer image for busybox:latest

hello world
```

* (a.2) Create and start a new BusyBox container. Include a ping to see that it is running and accessible. Press Ctrl+C after a few pings to stop the process and exit the container.

```
docker container run busybox ping 8.8.4.4
PING 8.8.4.4 (8.8.4.4): 56 data bytes
64 bytes from 8.8.4.4: seq=0 ttl=37 time=16.385 ms
64 bytes from 8.8.4.4: seq=1 ttl=37 time=13.981 ms
64 bytes from 8.8.4.4: seq=2 ttl=37 time=12.899 ms
64 bytes from 8.8.4.4: seq=3 ttl=37 time=14.085 ms
```

* (a.3) Create a second container, this time, in detached mode. Docker displays a long, hexadecimal number; this is the full container ID of your new container. This container is now running detached, which means it is running as a background process. Thus, it is not printing the ping results to your terminal.

```
docker container run --detach busybox ping 8.8.4.4
ac4765e9c91f277dc6b790ea92923993a72577031b2540e93af434c480e95370
```

### (b). Listing and removing containers

* (b.1) To see all of your running containers, you can run the command below. It includes useful information, such as the container name and ID and the image name. If you do not provide a name when initializing the container, Docker generates a random name.

```
docker container ls
CONTAINER ID   IMAGE     COMMAND          CREATED         STATUS         PORTS     NAMES
ac4765e9c91f   busybox   "ping 8.8.4.4"   2 minutes ago   Up 2 minutes             gracious_varahamihira
```

* (b.2) This command, however, only shows you the containers you have running. To see all containers, running or stopped, run the command below:

```
docker container ls --all
CONTAINER ID   IMAGE                                                          COMMAND                  CREATED         STATUS                      PORTS     NAMES
ac4765e9c91f   busybox                                                        "ping 8.8.4.4"           5 minutes ago   Up 5 minutes                          gracious_varahamihira
40c84ca44b94   busybox                                                        "ping 8.8.4.4"           6 minutes ago   Exited (0) 6 minutes ago              condescending_maxwell
```

* (b.3) You will notice that the temporary BusyBox container from previous example is shown here, with a status of Exited. You can remove this container with the docker rm command. In the command below, replace <CONTAINER ID> with the ID of your exited container. Note: You can typically just provide the first few characters of the container ID here.

```
docker container rm 40c8
40c8
```

* (b.4) With this command, you cannot directly remove a running container, only a stopped one. To learn more about the rm command and your options for forcing the removal of a running container, enter the help command below.

```
docker container rm --help

Usage:  docker container rm [OPTIONS] CONTAINER [CONTAINER...]

Remove one or more containers

Options:
  -f, --force     Force the removal of a running container (uses SIGKILL)
  -l, --link      Remove the specified link
  -v, --volumes   Remove anonymous volumes associated with the container
```

* (b.5) As you can see, adding --force will force the removal of a running container. Run a forced removal on your active BusyBox container, replacing <CONTAINER ID> with the first few characters from the ID of your container.

```
docker container rm --force ac47
ac47
```

* (b.6) The --help option can be applied to most commands within Docker if you want to see more information. Take a look at the options for the ls command by viewing the information under help.

```
docker container ls --help

Usage:  docker container ls [OPTIONS]

List containers

Aliases:
  ls, ps, list

Options:
  -a, --all             Show all containers (default shows just running)
  -f, --filter filter   Filter output based on conditions provided
      --format string   Pretty-print containers using a Go template
  -n, --last int        Show n last created containers (includes all states) (default -1)
  -l, --latest          Show the latest created container (includes all states)
      --no-trunc        Don't truncate output
  -q, --quiet           Only display container IDs
  -s, --size            Display total file sizes
```

* (b.7) You can play around with some of these options for listing containers. For instance, you can list all containers — both started and stopped — by only their numeric IDs:

```
docker container ls --all --quiet
```

* (b.8) You can also kill all containers, regardless of what state they are in. **Important!**: If you already had containers on your machine before this lab, **carefully** remove this workshop containers individually using their IDs.

```
docker container rm -–force $(docker container ls --quiet --all)
```

### (c). Writing to containers

* (c.1) Create another container using the BusyBox image, and connect to its shell in interactive mode. You can do this by using the -i flag (as well as the -t flag, which requests a TTY connection).

```
docker container run -it busybox sh
/ # 
```

* (c.2) From here, you can explore your container's file system using the ls command.

```
/ # ls -l
total 36
drwxr-xr-x    2 root     root         12288 Aug 20 16:21 bin
drwxr-xr-x    5 root     root           360 Aug 24 06:56 dev
drwxr-xr-x    1 root     root          4096 Aug 24 06:56 etc
drwxr-xr-x    2 nobody   nobody        4096 Aug 20 16:21 home
dr-xr-xr-x  200 root     root             0 Aug 24 06:56 proc
drwx------    1 root     root          4096 Aug 24 06:56 root
dr-xr-xr-x   13 root     root             0 Aug 24 06:56 sys
drwxrwxrwt    2 root     root          4096 Aug 20 16:21 tmp
drwxr-xr-x    3 root     root          4096 Aug 20 16:21 usr
drwxr-xr-x    4 root     root          4096 Aug 20 16:21 var
```

* (c.3) Create a new text file

```
echo 'Hello there…' > test.txt
```

* (c.4) List your files again to see that a text file has been created.

* (c.5) Exit your container

```
/ # exit
```

* (c.6) Run the same command as before to start another container from the same image.

```
docker container run -it busybox sh
```

* (c.7) Try to find your test.txt file inside this new container via the ls -l command. You will see that it is nowhere to be found. Exit this container.

```
/ # exit
```

## Building your container

### (d). Creating a New Container Image and Adding a New File

* (d.1) Run another new BusyBox container and drop it into a shell on that container.

```
docker run -it busybox sh
```

* (d.2) Create an empty file on this container.

```
/ # touch myfile.test
```

* (d.3) List your files to confirm that myfile.test has been created.

```
/ # ls -l
```

* (d.4) Exit your container

```
/ # exit
```

* (d.5) List all of your containers, but this time use the ps – or process status – command. It works the same as docker container ls and is often a shorthand choice.

```
docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

* (d.6) Notice that this only shows your running containers. Add the -a tag to see all containers, both running and stopped. Note that your results may not look exactly like the provided screenshot, but they should look similar.

```
docker ps -a
CONTAINER ID   IMAGE                                                          COMMAND                  CREATED          STATUS                      PORTS     NAMES
238c8c81b9dd   busybox                                                        "sh"                     3 minutes ago    Exited (0) 48 seconds ago             hopeful_almeida
0cb20705b4fb   busybox                                                        "sh"                     18 minutes ago   Exited (0) 7 minutes ago              modest_euler
```

* (d.7) You will use the diff command to see what has changed about a container relative to its image. To do this, use the ID of your most recent container in the command below to see the difference between the container and its base image. The results of this command show you information about what has changed. Lines that begin with an A show that a file or directory was added. Lines beginning with a C show that a file or directory was changed. Though none are present in this example, lines beginning with a D would indicate that a file or directory was deleted.

```
docker container diff 238c 
A /myfile.test
C /root
A /root/.ash_history
```

* (d.8) When you created myfile.test, you wrote information to the container's read/write layer. Now, you are going to save that read/write layer as a new read-only image layer. With this, you will create a new container image that reflects the additions you made. You can do this with the commit command, where myapp is the new image name and 1.0 is the image tag.

```
docker commit 238c myapp:1.0
sha256:745039f37ffad3de9b51ef1177485e3c37077bb78164b75dd13b4b5622aaaba4
```

* (d.9) Verify that your new image has been created by listing all of your images.

```
docker image ls
REPOSITORY                                                TAG                        IMAGE ID       CREATED              SIZE
myapp                                                     1.0                        745039f37ffa   About a minute ago   1.24MB
busybox                                                   latest                     42b97d3c2ae9   3 days ago           1.24MB
```

## Create a New Container Image via Build Process

### (e). Creating a containerized node application 

* (e.1) You are going to build a node application in a image based on a Dockerfile, so you can later run a container with it. Examine the contents of [node-app/Dockerfile](node-app/Dockerfile) and [node-app/server.js](node-app/server.js). Notice the base image that is used in the Dockerfile. 

```
docker build -t service:v1 node-app
[+] Building 10.5s (8/8) FINISHED                                                                                                                                                      
 => [internal] load build definition from Dockerfile                                                                                                                              0.0s
 => => transferring dockerfile: 37B                                                                                                                                               0.0s
 => [internal] load .dockerignore                                                                                                                                                 0.0s
 => => transferring context: 2B                                                                                                                                                   0.0s
 => [internal] load metadata for docker.io/library/node:10-slim                                                                                                                   2.2s
 => [auth] library/node:pull token for registry-1.docker.io                                                                                                                       0.0s
 => [internal] load build context                                                                                                                                                 0.0s
 => => transferring context: 31B                                                                                                                                                  0.0s
 => [1/2] FROM docker.io/library/node:10-slim@sha256:88932859e3d022d79161b99628c4c2c50e836437455e2d1b1a008d98367b10d6                                                             7.7s
 => => resolve docker.io/library/node:10-slim@sha256:88932859e3d022d79161b99628c4c2c50e836437455e2d1b1a008d98367b10d6                                                             0.0s
 => => sha256:88932859e3d022d79161b99628c4c2c50e836437455e2d1b1a008d98367b10d6 776B / 776B                                                                                        0.0s
 => => sha256:64c30c91d628d40eb8f772ee1477f78aff820e317e8afbc5160857ee804e4b70 1.37kB / 1.37kB                                                                                    0.0s
 => => sha256:6fbcbbb5c6032ce4013d4c736ffe54e0764c36fa14315ae54cb51f244e813c52 7.09kB / 7.09kB                                                                                    0.0s
 => => sha256:62deabe7a6db312ed773ccd640cd7cfbf51c22bf466886345684558f1036e358 22.53MB / 22.53MB                                                                                  4.2s
 => => sha256:f698164f6049bead44aeb7590e88d3df323011c20f0cedbff3d86f62e4c9f184 4.17kB / 4.17kB                                                                                    0.4s
 => => sha256:bc29352cb629712e7fbce7227a16b53308b541ef41e19122a04c15646756b176 21.91MB / 21.91MB                                                                                  4.9s
 => => sha256:85e84b4c858fae373ccdf48432de781210efb7fd75d9d801be9917577fe6ca09 2.93MB / 2.93MB                                                                                    2.7s
 => => sha256:ac72e4359589952a2e38fbe10287d792cbb57f2ec3cd1eb730e9bab685ac9754 295B / 295B                                                                                        2.9s
 => => extracting sha256:62deabe7a6db312ed773ccd640cd7cfbf51c22bf466886345684558f1036e358                                                                                         1.3s
 => => extracting sha256:f698164f6049bead44aeb7590e88d3df323011c20f0cedbff3d86f62e4c9f184                                                                                         0.1s
 => => extracting sha256:bc29352cb629712e7fbce7227a16b53308b541ef41e19122a04c15646756b176                                                                                         1.5s
 => => extracting sha256:85e84b4c858fae373ccdf48432de781210efb7fd75d9d801be9917577fe6ca09                                                                                         0.2s
 => => extracting sha256:ac72e4359589952a2e38fbe10287d792cbb57f2ec3cd1eb730e9bab685ac9754                                                                                         0.0s
 => [2/2] COPY server.js .                                                                                                                                                        0.4s
 => exporting to image                                                                                                                                                            0.0s
 => => exporting layers                                                                                                                                                           0.0s
 => => writing image sha256:97c94d88893b66d3a26c5bc316c67efe8ffc5cbad24aa5ab6163ac276cc3803f                                                                                      0.0s
 => => naming to docker.io/library/service:v1
```

(e.2) By reviewing your images again, you will see that your new container image has been created.

```
docker images
REPOSITORY                                                TAG                        IMAGE ID       CREATED          SIZE
service                                                   v1                         97c94d88893b   5 minutes ago    134MB
```

(e.3) Using the docker history command, you can look at the history of a given image. Run the command below to look at the history of the new service:v1 image you have created.

```
docker history service:v1
```

## (f). Remove Testing containers

* (f.1) Look at your list of all containers, both running and stopped.

```
docker ps -a
```

* (f.2) Stop and remove all of the containers you have created to this point, so that the previously assigned ports are made available again. You can do this in batches by using the two commands below — these commands stop and remove the set of containers returned by the ps -aq command in parentheses. **Important!**: If you already had containers on your machine before this lab, you should **carefully** remove the containers individually using their IDs.

```
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```

## (g). Run your container

* (g.1) This command runs the container from the service:v1 image in detached mode, names it myservice, and exposes the container's port 8080 on your host machine as port 8080. The written output is again your full container ID.

```
docker run -d --name myservice -p 8080:8080 service:v1
1cca730b6f8588a6f213d04a549cf395eefa9ccfda4c2d13039b7c61739b8310
```

* (g.2) Run docker ps again to see that your new container is running

```
docker ps
CONTAINER ID   IMAGE        COMMAND                  CREATED          STATUS          PORTS                                       NAMES
1cca730b6f85   service:v1   "docker-entrypoint.s…"   16 seconds ago   Up 14 seconds   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   myservice
```

* (g.3) By running the curl command below, you can verify that this container is, indeed, running the application that you created in your server.js file (you can use also your regular web browser)

```
curl http://127.0.0.1:8080
Hello World!
```

* (g.4) You also have the ability to inspect the resource usage statistics associated with your container. To do this, use the docker stats command.

```
docker stats myservice
```

* (g.5) Stop your container using the docker stop command. This time, since you provided a name to your container, you can use its name instead of its ID.

```
docker stop myservice
myservice
```

* (g.6) Remove your container with the docker rm command.

```
docker rm myservice
myservice
```

## Persisting Data with Bind Mounts

Bind mounts will map a local file or directory from your host filesystem to a container. It can be used to share files between the host and containers.

### (h) Start a Container with a Bind Mount

* (h.1) Run the following command to start a BusyBox container with a bind mount. This command specifies the directory of the bind mount on the host file system and mounts that directory into the mydata directory of the container file system.

```
docker run -it --name mytest -v $PWD/mydata:/mydata busybox
```

* (h.2) At this point, you are in a bash shell at the container level. Run the following commands to enter your mydata directory, add a file, and then exit the bash shell.

```
docker run -it --name mytest -v $PWD/mydata:/mydata busybox
/ # ls
bin     dev     etc     home    mydata  proc    root    sys     tmp     usr     var
/ # cd mydata
/mydata # touch myfile.txt
/mydata # exit
```

* (h.3) Use the docker inspect command to verify that the bind mount was created correctly in your mytest container. Observe the Mounts section of the output.

```
docker inspect mytest
```

* (h.4) Remove all of your containers. **Important!**: If you already had containers on your machine before this lab, you should **carefully** remove the containers individually using their IDs.

```
docker container rm -f $(docker container ls -aq)
```

* (h.6) Verify your myfile.txt file still exists in the mydata folder on the host machine.


## Persisting Data with Volumes

Using volumes will allow you to specify that the containers you are running will persist data in a filesystem section that is managed by Docker (e.g. `/var/lib/docker/volumes`). It can be used to share data between containers.

### (i). Creating a new volume

* (i.1) Create a new volume in Docker called demovol.

```
docker volume create demovol
```

* (i.2) Inspect the volume you have just created

```
docker volume inspect demovol
```

* (i.3) Enter this command to run a container with the demovol volume mounted, and then open a shell on that container.

```
docker container run -it -v demovol:/demo busybox sh
```

* (i.4) Run the ls command to list your file system.

```
/ # ls
bin   demo  dev   etc   home  proc  root  sys   tmp   usr   var
```

### (j). Adding a file to your volume

* (j.1) Add a file to your demovol volume. Use the command below to create and store mydata.dat inside the demo folder.

```
/ # echo 'my data' > /demo/mydata.dat
```

* (j.2) Exit the bash shell of this container.

```
/ # exit
```

### (k). Showing data persistence on a new container

* (k.1) Obtain the ID of the container you created in before, and then delete this container

```
docker container rm 5ed5
5ed5
```

* (k.2) Start a new container, once again using demovol as the mounted volume. This demonstrates the ability to have a persistent data source that can be used across multiple containers.

```
docker container run -d -v demovol:/demo busybox ping 8.8.8.8
1b5f7d8196ede9da7dc35fc8902f20f33817c70c5971289d6261b533ecbcad71
```

* (k.3) Obtain the new ID of this container (by using docker ps or docker container ls), and then use the ID to open a shell on the container.

```
docker container exec -it 1b5f sh
```

* (k.4) Run the cat command below to read and print the contents of your mydata.dat file. Notice that the file, now from within this new container, is still accessible as it was before.

```
/ # cat /demo/mydata.dat
my data
```

## InterSystems IRIS container

Instead of using docker commands, you can use `docker-compose` which is a tool for defining and running multi-container applications based on simple YAML configuration files.

### (l). Run an InterSystems IRIS Container

* (l.1) Have a look at [docker-compose.yml](docker-compose.yml). Try to figure out what means each section.

 
* (l.2) Run an InterSystems IRIS container using the [docker-compose.yml](docker-compose.yml) configuration in a detached mode. If you are running Docker on Windows please, un-comment the `command` section to avoid errors with the checking of Linux capabilities.

```
docker-compose up -d
Creating network "workshop-containers_default" with the default driver
Creating irishealth ... done
```

* (l.3) Have a look at the IRIS container logs:

```
docker logs irishealth
[INFO] Starting ISC Agent with command "/home/irisowner/irissys/startISCAgent.sh 2188"
Writing status to file: /home/irisowner/irissys/iscagent.status
Reading configuration from file: /home/irisowner/irissys/iscagent.conf
ISCAgent[16]: Starting
ISCAgent[18]: Starting ApplicationServer on *:2188
[INFO] Starting InterSystems IRIS instance IRIS...
[INFO] This copy of InterSystems IRIS has been licensed for use exclusively by:
InterSystems IRIS Community
Copyright (c) 1986-2021 by InterSystems Corporation
Any other use is a violation of your license agreement
Starting IRIS

08/24/21-08:47:25:943 (390) 0 [Generic.Event] Global buffer setting requires attention.  Auto-selected 25% of total memory.
08/24/21-08:47:26:012 (390) 0 [Generic.Event] Allocated 4681MB shared memory: 4002MB global buffers, 300MB routine buffers
08/24/21-08:47:26:013 (390) 0 [Crypto.IntelSandyBridgeAESNI] Intel Sandy Bridge AES-NI instructions detected.
08/24/21-08:47:26:126 (390) 0 [WriteDaemon.UsingWIJFile] Using WIJ file: /usr/irissys/mgr/IRIS.WIJ
```

* (l.4) Access the IRIS Management Portal at http://localhost:52773/csp/sys/UtilHome.csp. Log-in using default `superuser`/`SYS` password account. You will be asked to change the password.

* (l.5) Access IRIS using Terminal

```
docker exec -it irishealth bash
irisowner@1281cd6efb0c:~$ iris session iris

Node: 1281cd6efb0c, Instance: IRIS

USER>
```

* (l.6) Stop your IRIS container

```
docker-compose down
Removing irishealth ... done
Removing network workshop-containers_default
```

### (m). Using durable %SYS for data persistence

Durable %SYS ensures you can persist instance-specific data for containerized instances of InterSystems IRIS on durable storage.

* (m.1) Edit [docker-compose.yml](docker-compose.yml) and un-comment the `environment` section. This will enable durable %SYS in the IRIS instance, storing the configuration data in `shared/durable`.

* (m.2) Run again the steps in the previous example and notice the changes in `shared/durable`.
