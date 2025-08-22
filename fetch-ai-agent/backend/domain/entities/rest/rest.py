from uagents import Model

# Define your models
class Request(Model):
    text: str

class Message(Model):
    text: str

class Response(Model):
    timestamp: int
    result: str
    resultArray: list
    agent_address: str
