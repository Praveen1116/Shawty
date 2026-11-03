import asyncio
from app import main

original_generator = main.generate_short_code

codes = iter([
    "Nz8W46",
    original_generator()
])

generator_calls = 0

def controlled_generator():
    global generator_calls

    generator_calls += 1
    return next(codes)

async def test_collision():
    main.generate_short_code = controlled_generator

    try:
        request = main.URLRequest(
            original_url="https://example.com"
        )

        response = await main.create_short_url(request)

        print("Generator calls:", generator_calls)

        assert response.status_code == 201
        assert generator_calls == 2

        print("Collision retry verified!")
        print("Generator calls:", generator_calls)

        print("Status:", response.status_code)
        print("Response:", response.body.decode())

    finally:
        main.generate_short_code = original_generator

asyncio.run(test_collision())