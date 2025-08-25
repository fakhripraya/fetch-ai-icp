from uagents import Model
from typing import List

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


class RequestIdKosan(Model):
    idKosan: str


class ResponseGetKosan(Model):
    timestamp: int
    result: dict
    agent_address: str
