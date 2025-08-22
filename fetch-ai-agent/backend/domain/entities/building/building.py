from uagents import Model
from typing import Optional

# Define your models
class Building(Model):
    name: Optional[str] = None
    priceRange: Optional[float] = None
    facility: Optional[str] = None
    location: Optional[str] = None