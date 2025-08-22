# Function definitions for ASI1 function calling
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_boarding_house_details",
            "description": "Retrieve detailed information about a boarding house, such as its facilities, pricing, and owner contact details, based on the provided address (and optionally the name).",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The name of the boarding house, if known (optional)."
                    },
                    "priceRange": {
                        "type": "string",
                        "description": "Range of the price"
                    },
                    "location": {
                        "type": "string",
                        "description": "The full or partial address of the boarding house. This is required for fetching boarding house details."
                    },
                    "facility": {
                        "type": "string",
                        "description": "the facility from the boarding house(optional)"
                    },

                },
                "required": ["location","priceRange"],
                "additionalProperties": False
            },
            "strict": True
        }
    },
]