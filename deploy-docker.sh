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
    docker build --no-cache=true -t api:1.0 -f docker/api .
    restart_develop_module api
    echo "**** Finished updating api"
}

function postgres(){
    echo "#################"
    echo "Updating postgres"
    echo "#################"
    docker build --no-cache=true -t postgres:1.0 -f docker/postgres .
    restart_develop_module postgres
    echo "**** Finished updating postgres"
}

function usage(){
    echo "Usage: $0 <module>"
    echo
    echo " Valid modules: api postgres "
    echo
    echo " Example: $0 api"
}

case "$1" in
    api)
        api;;
    postgres)
        postgres;;
    *) echo
        usage;;
esac

