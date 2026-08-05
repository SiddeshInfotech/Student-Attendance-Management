from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is not None:
        # Keep it simple: just add success=False without nesting
        if isinstance(response.data, dict):
            response.data["success"] = False
        else:
            response.data = {"detail": response.data, "success": False}
    else:
        response = Response(
            {"detail": str(exc), "success": False},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
