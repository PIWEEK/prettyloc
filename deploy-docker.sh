DOCKER_COMPOSE=docker-compose

function restart_develop_module(){
    $DOCKER_COMPOSE -f docker/docker-compose.yml stop $1
    $DOCKER_COMPOSE -f docker/docker-compose.yml rm -v -f $1
    $DOCKER_COMPOSE -f docker/docker-compose.yml up -d --no-deps $1
}

function api(){
    echo "############"
    echo "Updating api"
    echo "############"
    docker build -t prettyloc_api:1.0 -f docker/api .
    restart_develop_module prettyloc_api
    echo "**** Finished updating api"
}

function postgres(){
    echo "#################"
    echo "Updating postgres"
    echo "#################"
    docker build -t prettyloc_postgres:1.0 -f docker/postgres .
    restart_develop_module prettyloc_postgres
    echo "**** Finished updating postgres"
}

function front(){
    echo "##############"
    echo "Updating front"
    echo "##############"
    docker build -t prettyloc_front:1.0 -f docker/front .
    restart_develop_module prettyloc_front
    echo "**** Finished updating front"
}

function all(){
    postgres
    api
    front
}

function usage(){
    echo "Usage: $0 <module>"
    echo
    echo " Valid modules: api postgres front all"
    echo
    echo " Example: $0 api"
}

case "$1" in
    api)
        api;;
    postgres)
        postgres;;
    front)
        front;;
    all)
        all;;
    *) echo
        usage;;
esac

