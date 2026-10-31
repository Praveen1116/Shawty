import secrets
import string

def generate_short_code():
    characters = string.ascii_letters + string.digits

    short_code = ''.join(
        secrets.choice(characters) for _ in range(6)
    )

    return short_code