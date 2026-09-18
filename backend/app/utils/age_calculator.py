from datetime import date, datetime
from typing import Optional


def calculate_age(dob: date) -> str:
    """Return human-readable age string from a date of birth."""
    today = date.today()
    years = today.year - dob.year
    months = today.month - dob.month

    if today.day < dob.day:
        months -= 1
    if months < 0:
        years -= 1
        months += 12

    if years < 0:
        return "0 Months"
    if years == 0 and months == 0:
        return "Less than 1 Month"
    if years == 0:
        return f"{months} {'Month' if months == 1 else 'Months'}"
    return f"{years} {'Year' if years == 1 else 'Years'} {months} {'Month' if months == 1 else 'Months'}"


def get_age_group(dob: date) -> str:
    """Classify pet into Young / Adult / Senior based on DOB."""
    today = date.today()
    age_years = (today - dob).days / 365.25
    if age_years < 1:
        return "Young"
    elif age_years <= 7:
        return "Adult"
    return "Senior"
