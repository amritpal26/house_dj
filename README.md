# house_party

## Setting up virtual environment
In the root directory run the following commands:
1. `pip install virtualenv`
2. `python -m virtualenv venv`
3. `source venv/bin/activate`
4. `pip install django djangorestframework`

Note: make sure the right version of python is installed. This project uses python 3. So instead of python may need to use `python3`


## Running the project
1. Start the django server: `cd music_controller; python manage.py makemigrations; python manage.py migrate; python manage.py runserver`
2. Start development frontend react server: `cd music_controller/client; npm install; npm run dev`
