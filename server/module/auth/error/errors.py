from enum import Enum


class Errors(Enum):
    SAGE_V201 = {"kind": "DHRUVA-201", "message": "Failed to get user details from db"}
    SAGE_V202 = {"kind": "DHRUVA-202", "message": "Failed to compare password hash"}
    SAGE_V203 = {
        "kind": "DHRUVA-203",
        "message": "Failed to store auth token data in db",
    }
    SAGE_V204 = {
        "kind": "DHRUVA-204",
        "message": "Failed to create api key",
    }
    SAGE_V205 = {
        "kind": "DHRUVA-205",
        "message": "Failed to get all api keys",
    }
    SAGE_V206 = {
        "kind": "DHRUVA-206",
        "message": "Failed to get user",
    }
    SAGE_V207 = {
        "kind": "DHRUVA-207",
        "message": "Failed to create user",
    }
    SAGE_V208 = {
        "kind": "DHRUVA-208",
        "message": "Failed to get api key",
    }
    SAGE_V209 = {
        "kind": "DHRUVA-209",
        "message": "Failed to update api key status",
    }
    SAGE_V210 = {
        "kind": "DHRUVA-210",
        "message": "Failed to update api key tracking status",
    }
    SAGE_V211 = {
        "kind": "DHRUVA-211",
        "message": "Failed to modify api key params",
    }
    SAGE_V212 = {
        "kind": "DHRUVA-212",
        "message": "Failed to modify user details",
    }
