from enum import Enum


class Errors(Enum):
    SAGE_V101 = {"kind": "DHRUVA-101", "message": "Failed to send request"}
    SAGE_V102 = {
        "kind": "DHRUVA-102",
        "message": "Request responded with failed status",
    }
    SAGE_V103 = {"kind": "DHRUVA-103", "message": "Failed to fetch all services"}
    SAGE_V104 = {
        "kind": "DHRUVA-104",
        "message": "Failed to get service details from db",
    }
    SAGE_V105 = {"kind": "DHRUVA-105", "message": "Failed to get model details from db"}
    SAGE_V106 = {"kind": "DHRUVA-106", "message": "Failed to fetch all models"}
    SAGE_V107 = {"kind": "DHRUVA-107", "message": "Failed to get triton ready"}
    SAGE_V108 = {"kind": "DHRUVA-108", "message": "Failed to parse request"}
    SAGE_V109 = {
        "kind": "DHRUVA-109",
        "message": "Failed to get Dashboard details from db",
    }
    SAGE_V110 = {"kind": "DHRUVA-110", "message": "Failed to submit feedback"}
    SAGE_V111 = {
        "kind": "DHRUVA-111",
        "message": "Failed to send request to create grafana snapshot",
    }
    SAGE_V112 = {
        "kind": "DHRUVA-112",
        "message": "Request to create grafana snapshot responded with failed status",
    }
    SAGE_V113 = {
        "kind": "DHRUVA-113",
        "message": "Failed to update health status of service",
    }
    SAGE_V114 = {
        "kind": "DHRUVA-114",
        "message": "Failed to fetch feedback",
    }
    SAGE_V115 = {
        "kind": "DHRUVA-115",
        "message": "Invalid task type in database",
    }
    SAGE_V116 = {"kind": "DHRUVA-116", "message": "Failed to fetch file from link"}
