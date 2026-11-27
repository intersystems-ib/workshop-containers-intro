# Workshop: Containers Intro
This repository contains some basic examples you can use to learn about containers and InterSystems IRIS.

Based on: https://github.com/intersystems/Samples-Containers-Bootcamp by Kerry Kirkham

# What do you need to install? 
* [Git](https://git-scm.com/downloads) 
* [Docker](https://www.docker.com/products/docker-desktop) (if you are using Windows, make sure you set your Docker installation to use "Linux containers").
* [Docker Compose](https://docs.docker.com/compose/install/) v2 or later (included in Docker Desktop and used as `docker compose`).
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

Aliases:
  docker container rm, docker container remove, docker rm

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
  docker container ls, docker container list, docker container ps, docker ps

Options:
  -a, --all             Show all containers (default shows just running)
  -f, --filter filter   Filter output based on conditions provided
      --format string   Format output using a custom template:
                        'table':            Print output in table format
                        with column headers (default)
                        'table TEMPLATE':   Print output in table format
                        using the given Go template
                        'json':             Print in JSON format
                        'TEMPLATE':         Print output using the given
                        Go template.
                        Refer to https://docs.docker.com/go/formatting/
                        for more information about formatting output with
                        templates
  -n, --last int        Show n last created containers (includes all
                        states) (default -1)
  -l, --latest          Show the latest created container (includes all
                        states)
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
docker container rm --force $(docker container ls --quiet --all)
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
f163195036c6   busybox                                                        "sh"                     3 minutes ago    Exited (0) 48 seconds ago             hopeful_almeida
0cb20705b4fb   busybox                                                        "sh"                     18 minutes ago   Exited (0) 7 minutes ago              modest_euler
```

* (d.7) You will use the diff command to see what has changed about a container relative to its image. To do this, use the ID of your most recent container in the command below to see the difference between the container and its base image. The results of this command show you information about what has changed. Lines that begin with an A show that a file or directory was added. Lines beginning with a C show that a file or directory was changed. Though none are present in this example, lines beginning with a D would indicate that a file or directory was deleted.

```
docker container diff f163 
A /myfile.test
C /root
A /root/.ash_history
```

* (d.8) When you created myfile.test, you wrote information to the container's read/write layer. Now, you are going to save that read/write layer as a new read-only image layer. With this, you will create a new container image that reflects the additions you made. You can do this with the commit command, where myapp is the new image name and 1.0 is the image tag.

```
docker commit f163 myapp:1.0
sha256:4c047990a30950fb37486df6d5b618f12063364b78ef36e9b0586314a8631899
```

* (d.9) Verify that your new image has been created by listing all of your images.

```
docker image ls
IMAGE                                                               ID             DISK USAGE   CONTENT SIZE   EXTRA
myapp:1.0                                                           4c047990a309       6.85MB         2.23MB        
busybox:latest                                                      fd8d9aa63ba2       6.81MB         2.23MB        
```

## Create a New Container Image via Build Process

### (e). Creating a containerized node application 

* (e.1) You are going to build a node application in a image based on a Dockerfile, so you can later run a container with it. Examine the contents of [node-app/Dockerfile](node-app/Dockerfile) and [node-app/server.js](node-app/server.js). Notice the base image that is used in the Dockerfile. 

```
docker build -t service:v1 node-app
[+] Building 7.8s (7/7) FINISHED                                                                    docker:desktop-linux
 => [internal] load build definition from Dockerfile                                                                0.1s
 => => transferring dockerfile: 203B                                                                                0.0s
 => [internal] load metadata for docker.io/library/node:26-slim                                                     2.1s
 => [internal] load .dockerignore                                                                                   0.1s
 => => transferring context: 2B                                                                                     0.0s
 => [internal] load build context                                                                                   0.1s
 => => transferring context: 329B                                                                                   0.0s
 => [1/2] FROM docker.io/library/node:26-slim@sha256:abe7e5a82b61a8ef67b315b85497c9e65173387ccf2f4a029248184b8e020  4.5s
 => => resolve docker.io/library/node:26-slim@sha256:abe7e5a82b61a8ef67b315b85497c9e65173387ccf2f4a029248184b8e020  0.1s
 => => sha256:8d7a35637e3ee94f9a2e744da13e8a067339dcabb4b102e1e0708daecd5a5457 448B / 448B                          0.2s
 => => sha256:a284588d1ed707e58cf24a3d5b743293246ce495d3a672d91cb781be52fab349 55.89MB / 55.89MB                    3.3s
 => => sha256:82b4e27b427ae82a2a858d6066557605c1d9c64e63d63e6305c8537d60c673b8 3.31kB / 3.31kB                      0.4s
 => => sha256:40748add9f4f6f944f334cbfc286590d6e93f60fb06f6ee7ffa1b894080ad861 29.84MB / 29.84MB                    2.0s
 => => extracting sha256:40748add9f4f6f944f334cbfc286590d6e93f60fb06f6ee7ffa1b894080ad861                           0.7s
 => => extracting sha256:82b4e27b427ae82a2a858d6066557605c1d9c64e63d63e6305c8537d60c673b8                           0.0s
 => => extracting sha256:a284588d1ed707e58cf24a3d5b743293246ce495d3a672d91cb781be52fab349                           0.9s
 => => extracting sha256:8d7a35637e3ee94f9a2e744da13e8a067339dcabb4b102e1e0708daecd5a5457                           0.0s
 => [2/2] COPY server.js .                                                                                          0.2s
 => exporting to image                                                                                              0.5s
 => => exporting layers                                                                                             0.2s
 => => exporting manifest sha256:eb8eca83d60c6001a41899f27161905419628b4a9d1222c21bb1e59a1d75f0a9                   0.0s
 => => exporting config sha256:39dab6f5bbef780f75187927966fd763692497c6ff1afdd4246d6ecd254d3113                     0.0s
 => => exporting attestation manifest sha256:8fe0fcb4a7ec06f7fe8afddf25f60ebe4b64664e5581794764da9d367148450c       0.1s
 => => exporting manifest list sha256:27e4aa25218e77fd3d853889c27a78e7b14b2baffb0dc84a4f11d8e9dbcac724              0.0s
 => => naming to docker.io/library/service:v1                                                                       0.0s
 => => unpacking to docker.io/library/service:v1                                                                    0.1s
```

(e.2) By reviewing your images again, you will see that your new container image has been created.

```
docker images
IMAGE                                                               ID             DISK USAGE   CONTENT SIZE   EXTRA
service:v1                                                          27e4aa25218e        353MB         85.7MB        
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
fcc26b34927a2b84c0fb454addb5a54c1a84efb813f8e245b3ff8a2606bcb2ba
```

* (g.2) Run docker ps again to see that your new container is running

```
docker ps
CONTAINER ID   IMAGE        COMMAND                  CREATED          STATUS          PORTS                                         NAMES
fcc26b34927a   service:v1   "docker-entrypoint.s…"   19 seconds ago   Up 19 seconds   0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp   myservice
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

Instead of using docker commands, you can use Docker Compose (`docker compose`), which is a tool for defining and running multi-container applications based on simple YAML configuration files.

### (l). Run an InterSystems IRIS Container

* (l.1) Have a look at [docker-compose.yml](docker-compose.yml). Try to figure out what means each section.

 
* (l.2) Run an InterSystems IRIS container using the [docker-compose.yml](docker-compose.yml) configuration in a detached mode. If you are running Docker on Windows please, un-comment the `command` section to avoid errors with the checking of Linux capabilities.

```
docker compose up -d
[+] up 2/2
 ✔ Network clean-up_containers-intro_default Created                                                                 0.1s
 ✔ Container iris                            Started                                                                 0.7s
```
Note: Docker Compose automatically generates a default network name based on the project name, which usually corresponds to the directory containing the Compose project. Therefore, the network name may vary depending on where the repository is cloned or how the Compose project is named.

For example, in this case the network appears as `clean-up_containers-intro_default`, but you could have `workshop-containers-intro_default` or another name.

* (l.3) Have a look at the IRIS container logs:

```
docker logs iris
[INFO] Starting InterSystems IRIS instance IRIS...
[INFO] Starting Control Process
Global buffer setting requires attention.  Auto-selected 25% of total memory.
Allocated 9758MB shared memory
7955MB global buffers, 795MB routine buffers
This copy of InterSystems IRIS has been licensed for use exclusively by:
InterSystems IRIS Community
Copyright (c) 1986-2026 by InterSystems Corporation
Any other use is a violation of your license agreement

1 alert(s) during startup. See messages.log for details.
Starting IRIS

11/24/26-12:37:40:299 (411) 0 [Generic.Event] Global buffer setting requires attention.  Auto-selected 25% of total memory.
11/24/26-12:37:40:507 (411) 0 [Generic.Event] Allocated 9758MB shared memory
11/24/26-12:37:40:507 (411) 0 [Generic.Event] 7955MB global buffers, 795MB routine buffers, 64MB journal buffers, 622MB buffer descriptors, 300MB heap, 5MB ECP, 17MB miscellaneous
11/24/26-12:37:40:516 (411) 0 [Crypto.IntelSandyBridgeAESNI] Intel Sandy Bridge or AMD x8 AES-NI instructions detected.
11/24/26-12:37:40:516 (411) 0 [SIMD] SIMD optimization level: arch=x86-64-v3
11/24/26-12:37:40:784 (411) 0 [WriteDaemon.UsingWIJFile] Using WIJ file: /usr/irissys/mgr/IRIS.WIJ
11/24/26-12:37:40:784 (411) 0 [Generic.Event] No journaling info from prior system
11/24/26-12:37:40:784 (411) 0 [WriteDaemon.CreatingNewWIJ] Creating a new WIJ file
11/24/26-12:37:40:800 (411) 0 [WriteDaemon.CreatedNewWIJ] New WIJ file created
11/24/26-12:37:40:809 (411) 0 [Generic.Event] 
Startup of InterSystems IRIS [IRIS for UNIX (Ubuntu Server LTS for x86-64 Containers) 2026.1 (Build 234U) Fri Mar 27 2026 14:07:14 EDT]
        in /usr/irissys/bin/
        with mgr: /usr/irissys/mgr
        with wij: /usr/irissys/mgr/IRIS.WIJ
        from: /usr/irissys/mgr/
  OS=[Linux], version=[#1 SMP PREEMPT_DYNAMIC Thu Jun  5 18:30:46 UTC 2025], release=[6.6.87.2-microsoft-standard-WSL2], machine=[x86_64]
  nodename=[120c68ff44b6].
  numasyncwijbuf: 8, wdwrite_asyncio_max: 64, wijdirectio: on, synctype: 3
  System Initialized.
11/24/26-12:37:40:821 (452) 0 [WriteDaemon.Started] Write daemon started.
11/24/26-12:37:41:050 (463) 0 [Database.MountedRW] Mounted database /usr/irissys/mgr/ (SFN 0) read-write.
11/24/26-12:37:42:210 (463) 0 [Database.MountedRO] Mounted database /usr/irissys/mgr/irislib/ (SFN 1) read-only. Database label is marked read-only. 
11/24/26-12:37:42:215 (463) 0 [Utility.Event] Instance 'IRIS' starting on node 120c68ff44b6 by user 'irisowner' on 11/24/2026 12:37:42.215 UTC
11/24/26-12:37:42:215 (463) 0 [Utility.Event] Using parameters from file '/usr/irissys/iris.cpf'
11/24/26-12:37:42:216 (463) 0 [Utility.Event] Loading DLLs
11/24/26-12:37:42:217 (463) 0 [Utility.Event] Switching to temporary %SYS Namespace
11/24/26-12:37:42:234 (463) 0 [Database.MountedRW] Mounted database /usr/irissys/mgr/irissecurity/ (SFN 2) read-write.
11/24/26-12:37:42:239 (463) 0 [Utility.Event] Loading Locale enuw (English, United States, Unicode) from objects
11/24/26-12:37:42:290 (463) 0 [Database.MountedRW] Mounted database /usr/irissys/mgr/irislocaldata/ (SFN 3) read-write.
11/24/26-12:37:42:293 (463) 0 [Utility.Event] Using OpenSSL 3.0.13 30 Jan 2024
11/24/26-12:37:42:350 (463) 0 [Database.MountedRW] Mounted database /usr/irissys/mgr/iristemp/ (SFN 4) read-write.
11/24/26-12:37:42:352 (463) 0 [Utility.Event] /usr/irissys/mgr/iristemp/ initialized as IRISTEMP
11/24/26-12:37:42:353 (463) 0 [Utility.Event] Switching to default %SYS Namespace
11/24/26-12:37:42:368 (464) 0 [Utility.Event] Log Monitor Started
11/24/26-12:37:42:486 (465) 0 [Utility.Event] Clean Daemon Started
11/24/26-12:37:42:504 (463) 0 [Utility.Event] No archives configured
11/24/26-12:37:42:512 (463) 0 [Utility.Event] Performing Journal Recovery
11/24/26-12:37:42:513 (463) 0 [Utility.Event] Graceful system shutdown, journal restore not required
11/24/26-12:37:42:513 (463) 0 [Utility.Event] Graceful system shutdown, transaction rollback not required
11/24/26-12:37:42:532 (463) 0 [Utility.Event] START: /usr/irissys/mgr/journal/20261124.001
11/24/26-12:37:42:560 (463) 0 [Generic.Event] INTERSYSTEMS IRIS JOURNALING SYSTEM MESSAGE
Journaling started to: /usr/irissys/mgr/journal/20261124.001
11/24/26-12:37:42:560 (463) 0 [Utility.Event] Journaling to /usr/irissys/mgr/journal/20261124.001 started.
11/24/26-12:37:42:560 (463) 0 [Utility.Event] Processing WorkQueues section
11/24/26-12:37:42:561 (463) 0 [Utility.Event] Processing Startup section
11/24/26-12:37:42:569 (466) 0 [Utility.Event] Purging old application errors
11/24/26-12:37:42:576 (463) 0 [Utility.Event] Processing config section
11/24/26-12:37:42:587 (468) 0 [Utility.Event] LMF Info:  Licensed for 8 users.
11/24/26-12:37:42:587 (468) 0 [Utility.Event] LMF Info: License Key Order Number is 54702
11/24/26-12:37:42:596 (463) 0 [Utility.Event] Initializing Security system
11/24/26-12:37:42:620 (463) 0 [Utility.Event] Processing Network section
11/24/26-12:37:42:622 (463) 0 [Utility.Event] Activating Network
11/24/26-12:37:42:630 (463) 0 [Utility.Event] Processing Databases section
11/24/26-12:37:42:676 (463) 0 [Database.MountedRW] Mounted database /usr/irissys/mgr/irisaudit/ (SFN 5) read-write.
11/24/26-12:37:42:694 (463) 0 [Database.MountedRW] Mounted database /usr/irissys/mgr/irismetrics/ (SFN 6) read-write.
11/24/26-12:37:42:695 (463) 0 [Utility.Event] Processing Namespaces section
11/24/26-12:37:42:695 (463) 0 [Utility.Event] Namespaces are up to date
11/24/26-12:37:42:695 (463) 0 [Utility.Event] Activating namespaces
11/24/26-12:37:42:697 (463) 0 [Utility.Event] Activating new namespace map
11/24/26-12:37:42:704 (463) 0 [Utility.Event] Namespace changes have been activated
11/24/26-12:37:42:713 (471) 0 [Utility.Event] Starting superserver on port 1972
11/24/26-12:37:42:713 (463) 0 [Utility.Event] Network Lock Upload Phase Starting
11/24/26-12:37:42:714 (463) 0 [Utility.Event] Lock Upload Phase Complete
11/24/26-12:37:42:714 (463) 0 [Utility.Event] Processing Miscellaneous section
11/24/26-12:37:42:733 (474) 0 [Utility.Event] Starting Servers
11/24/26-12:37:42:737 (463) 0 [Utility.Event] Processing Devices section
11/24/26-12:37:42:738 (463) 0 [Utility.Event] Processing DeviceSubTypes section
11/24/26-12:37:42:741 (463) 0 [Utility.Event] Processing MagTape section
11/24/26-12:37:42:745 (463) 0 [Utility.Event] Processing IO section
11/24/26-12:37:42:745 (463) 0 [Utility.Event] Processing SQL section
11/24/26-12:37:42:747 (463) 0 [Utility.Event] Processing Macro Pre-Processor (MPP) section
11/24/26-12:37:42:748 (463) 0 [Utility.Event] Processing OS Package Requirements section
11/24/26-12:37:42:803 (463) 0 [Generic.Event] Auditing to /usr/irissys/mgr/irisaudit/
11/24/26-12:37:42:839 (463) 0 [Utility.Event] Rebuilding Extent index for namespace USER
11/24/26-12:37:42:853 (474) 0 [Utility.Event] Private webserver started on 52773
11/24/26-12:37:42:854 (474) 0 [Utility.Event] Processing Shadows section (this system as shadow)
11/24/26-12:37:42:854 (463) 0 [Database.MountedRW] Mounted database /usr/irissys/mgr/user/ (SFN 7) read-write.
11/24/26-12:37:42:856 (474) 0 [Utility.Event] Processing Monitor section
11/24/26-12:37:42:864 (625) 0 [Utility.Event] WorkQueue: Starting work queue daemon parent=474
11/24/26-12:37:42:881 (474) 0 [Utility.Event] Processing Logging section
11/24/26-12:37:42:881 (627) 0 [Utility.Event] [SYSTEM MONITOR] System Monitor started in %SYS
11/24/26-12:37:42:882 (474) 0 [Utility.Event] Shard license: 0
11/24/26-12:37:44:355 (463) 0 [Database.MountedRO] Mounted database /usr/irissys/mgr/enslib/ (SFN 8) read-only. Database label is marked read-only. 
11/24/26-12:37:44:766 (462) 0 [Database.StartExpansion] Starting Expansion for database /usr/irissys/mgr/user/. 10 MB requested.
11/24/26-12:37:44:770 (462) 0 [Database.FullExpansion] Expansion completed for database /usr/irissys/mgr/user/. Expanded by 10 MB. New size is 11 MB.
11/24/26-12:37:44:771 (463) 0 [Utility.Event] Rebuild of Extent index completed
11/24/26-12:37:44:772 (463) 0 [Utility.Event] Enabling logons
11/24/26-12:37:44:775 (463) 0 [Utility.Event] Interoperability System including auto-start of productions Starting
11/24/26-12:37:44:778 (463) 0 [Utility.Event] Initializing Interoperability during system startup
11/24/26-12:37:44:786 (463) 0 [Utility.Event] Interoperability System Startup Complete
11/24/26-12:37:44:787 (463) 0 [Utility.Event] System Info: $system=120c68ff44b6:IRIS GUID=B6A77978-D3A9-11F1-90CB-AA1FF2E09D6E SystemMode=
[INFO] IRIS^/usr/irissys^2026.1.0.234.1com^running, since Tue Nov 24 12:37:40 2026^iris.cpf^1972^52773^0^ok^IRIS^^^/usr/irissys^1972
[INFO] ...started InterSystems IRIS instance IRIS
11/24/26-12:37:44:877 (626) 0 [Utility.Event] Starting TASKMGR
```

* (l.4) Access the IRIS Management Portal at http://localhost:52773/csp/sys/UtilHome.csp. Log-in using default `superuser`/`SYS` password account. You will be asked to change the password.

* (l.5) Access IRIS using Terminal

```
docker exec -it iris bash
irisowner@1281cd6efb0c:~$ iris session iris

Node: 1281cd6efb0c, Instance: IRIS

USER>
```

* (l.6) Stop your IRIS container

```
docker compose down
[+] down 2/2
 ✔ Container iris                            Removed                                                                                                                                                                                                                                                1.6s
 ✔ Network clean-up_containers-intro_default Removed                                                                                                                                                                                                                                                0.3s 
```

Note: Docker Compose automatically generates a default network name based on the project name, which usually corresponds to the directory containing the Compose project. Therefore, the network name may vary depending on where the repository is cloned or how the Compose project is named.

For example, in this case the network appears as `clean-up_containers-intro_default`, but you could have `workshop-containers-intro_default` or another name.

### (m). Using durable %SYS for data persistence

Durable %SYS ensures you can persist instance-specific data for containerized instances of InterSystems IRIS on durable storage.

By default, changes made inside a container may be lost when the container is removed and recreated. Durable %SYS addresses this by storing supported system data, such as security settings, users, roles, and other instance-specific configurations, in a persist directory.

This is particularly useful in Docker environments, where containers can be rebuilt or replaced without losing their persisted system configuration. Durable %SYS does not automatically persist all application databases, which may require separate persistent storage.

In this example, the `ISC_DATA_DIRECTORY` environment variable enables durable %SYS, while a Docker bind mount stores the persistent data in the local `shared/durable` directory.

* (m.1) Edit [docker-compose.yml](docker-compose.yml) and un-comment the `environment` section and `- ISC_DATA_DIRECTORY=/shared/durable` and leave commented `ISC_CPF_MERGE_FILE`. This will enable durable %SYS in the IRIS instance, storing the configuration data in `shared/durable`.

* (m.2) Run again the steps in the previous example and notice the changes in `shared/durable`.

### (n). Using CPF Merge for IRIS Configuration

The CPF Merge (Configuration Parameters File Merge) is an IRIS startup mechanism that allows you to apply custom configuration parameters to an InterSystems IRIS instance using an external configuration file. 

InterSystems IRIS uses a configuration file called iris.cpf to define instance-specific settings, including network ports, memory allocation, database configuration, and other system parameters. So, CPF Merge allows configuration changes to be applied without directly modifying the original iris.cpf.

This is particularly useful in containerized environments, where configuration should be automated, reproducible, and easy to maintain.

A CPF merge file contains only the configuration sections and parameters that need to be modified. During the merge process, IRIS applies these settings to its configuration.

The general workflow of using CPF Merge with Docker is:

1. Create a CPF merge file containing the required configuration changes.

2. Make the file available inside the IRIS container.

3. Configure the container initialization process to apply the merge file.

4. Start IRIS and verify that the configuration changes have been applied.

Benefits of CPF Merge: 

* Automated configuration: apply IRIS settings without manually editing the Management Portal.

* Reproducibility: use the same configuration across different environments

* Maintainability: keep configuration changes separate from the original iris.cpf.

There are some considerations:

* CPF Merge modifies IRIS configuration parameters, but it does not replace Docker port publishing. 

* Additionally, not every IRIS configuration setting is managed through CPF Merge. Some settings require ObjectScript configuration APIs or other mechanisms.

In this example, the merge file [config/merge.cpf](config/merge.cpf) applies the following changes when IRIS starts:

* `[config]` section: memory settings — 256 MB of database cache for 8 KB blocks (`globals`), 64 MB of routine cache (`routines`) and 65536 KB of generic memory heap (`gmheap`, in KB).
* `[Actions]` section: creates two databases (`DOCKER_DATA` and `DOCKER_CODE`) and a new namespace `DOCKER` that uses them, with Interoperability enabled (`Interop=1`).

```
[config]
globals=0,0,256,0,0,0
gmheap=65536
routines=64

[Actions]
CreateDatabase:Name=DOCKER_DATA,Directory=/shared/DOCKER_DATA
CreateDatabase:Name=DOCKER_CODE,Directory=/shared/DOCKER_CODE
CreateNamespace:Name=DOCKER,Globals=DOCKER_DATA,Routines=DOCKER_CODE,Interop=1
```

The database directories are inside `/shared`, the bind mount of the local `shared` folder, so the database files are stored on your local machine and are not lost when the container is removed.

> `CreateDatabase` creates only the last folder of the path (`DOCKER_DATA`), not its parent folders. The parent folder must already exist inside the container. `/shared` always exists because it is the mount point. If you use a path such as `/shared/durable/DOCKER_DATA` without durable %SYS enabled, the `durable` folder does not exist and the merge fails.

* (n.1) Have a look at [config/merge.cpf](config/merge.cpf) and try to figure out what each line does.

* (n.2) If your IRIS container is running, stop it:

```
docker compose down
```

* (n.3) Edit [docker-compose.yml](docker-compose.yml) and un-comment the lines related to the merge file:
  * `- ./config:/config` in the `volumes` section: makes the local `config` folder (with `merge.cpf`) available inside the container in `/config`.
  * `environment:` (if you did not already un-comment it in the previous example) and `- ISC_CPF_MERGE_FILE=/config/merge.cpf`: tells IRIS which merge file to apply at startup.

  CPF Merge does **not** require durable %SYS: the `- ISC_DATA_DIRECTORY=/shared/durable` line can stay commented. Your `docker-compose.yml` should look like this (keep `command` un-commented if you are running Docker on Windows):

```yaml
services:
  iris:
    image: containers.intersystems.com/intersystems/iris-community:latest-em
    container_name: iris
    ports:
    - "1972:1972"
    - "52773:52773"
    volumes:
    - ./shared:/shared
    - ./config:/config

    #command: --check-caps false
    environment:
    #- ISC_DATA_DIRECTORY=/shared/durable
    - ISC_CPF_MERGE_FILE=/config/merge.cpf
```

> If you also un-comment `- ISC_DATA_DIRECTORY=/shared/durable` (durable %SYS from the previous example), the merge file is applied in the same way. The difference is where the instance configuration file `iris.cpf` is stored (see step n.7).

* (n.4) Start the IRIS container again:

```
docker compose up -d
```

* (n.5) Have a look at the container logs and check that IRIS started without errors. The memory allocation messages should now show the values defined in the merge file (256 MB of global buffers and 64 MB of routine buffers):

```
docker logs iris
```

  Look for the merge messages, such as `Merging /config/merge.cpf into /usr/irissys/iris.cpf` and `Executing [Actions] section`. The container can show `healthy` even if the merge fails, because the `[Actions]` section runs after IRIS has started. If the namespace or the databases are not created, search the logs for `ERROR #507`, which shows the action that failed and why.


* (n.6) Access the IRIS Management Portal at http://localhost:52773/csp/sys/UtilHome.csp and check the changes:

  * **Memory**: go to *System Administration > Configuration > System Configuration > Memory and Startup*. The memory allocated for the 8 KB database cache should be `256` MB and the routine cache should be `64` MB.
  * **Generic memory heap**: go to *System Administration > Configuration > Additional Settings > Advanced Memory*. The `gmheap` value should be `65536` (KB).
  * **Databases**: go to *System Administration > Configuration > System Configuration > Local Databases*. You should see the new `DOCKER_DATA` and `DOCKER_CODE` databases, in the directories defined in the merge file (`/shared/DOCKER_DATA` and `/shared/DOCKER_CODE`). You can also see their `IRIS.DAT` files in the local `shared` folder.
  * **Namespace**: go to *System Administration > Configuration > System Configuration > Namespaces*. You should see the new `DOCKER` namespace, using `DOCKER_DATA` for globals and `DOCKER_CODE` for routines.
  * **Interoperability**: go to the *Interoperability* menu and change to the `DOCKER` namespace (using the namespace selector at the top of the page). The namespace is available because it was created with `Interop=1`.

* (n.7) The merged configuration is also written to the instance configuration file `iris.cpf`. Look for the `[config]` values and the new `DOCKER_DATA`, `DOCKER_CODE` and `DOCKER` entries in the `[Databases]` and `[Namespaces]` sections. Its location depends on whether durable %SYS is enabled:

  * **Without durable %SYS** (`ISC_DATA_DIRECTORY` commented): the file is inside the container. Display it with:

```
docker exec -it iris cat /usr/irissys/iris.cpf
```

  * **With durable %SYS** (`ISC_DATA_DIRECTORY` un-commented): the file is stored on your local machine. Open `shared/durable/iris.cpf`.

> Without durable %SYS, any change you make manually in the Management Portal is lost when the container is recreated, but the settings in `merge.cpf` are applied again on every startup.

* (n.8) Stop your IRIS container:

```
docker compose down
```
