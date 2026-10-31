import psycopg
import os
from dotenv import load_dotenv
load_dotenv()

database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise ValueError("DATABASE_URL is missing")

# connection = psycopg.connect(database_url)
# print("Database connected successfully")

# cursor = connection.cursor()
# cursor.execute("SELECT current_user, current_database();")
# result = cursor.fetchone()
# print(result)

# cursor.close()
# connection.close()

with psycopg.connect(database_url) as connection:
    with connection.cursor() as cursor:
        cursor.execute("SELECT current_user, current_database();")

        result = cursor.fetchone()

        print(result)