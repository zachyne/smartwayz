## Getting started

 - build repository
 - ``` docker compose up --build ```
 - ``` docker compose run --rm django-web python manage.py migrate ```
 
### check the image using
 - ``` docker image list ```

 ### access db
 ``` docker compose exec db psql -U postgres -d smartwayzdb ```


