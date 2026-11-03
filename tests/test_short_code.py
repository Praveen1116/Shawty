from app.short_code import generate_short_code

def test_short_code_length():
    short_code = generate_short_code()

    assert len(short_code) == 6

def test_short_contains_only_alphanumeric_characters():
    short_code = generate_short_code()

    assert short_code.isalnum()

def test_multiple_generated_codes_are_valid():
    for _ in range(100):
        short_code = generate_short_code()

        assert len(short_code) == 6
        assert short_code.isalnum()