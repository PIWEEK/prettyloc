# prettyloc

1. Install docker and docker-compose
2. ./deploy-docker.sh postgres
3. ./deploy-docker.sh api
4. docker exec -ti api /bin/bash
5. /myvenv/bin/python manage.py createsuperuser
6. http://localhost:8000
