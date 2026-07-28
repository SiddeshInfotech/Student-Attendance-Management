from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "message"]
    ordering_fields = ["created_at"]

    @action(detail=False, methods=["get"])
    def student_notifications(self, request):
        user_id = getattr(request.user, "user_id", getattr(request.user, "id", None))
        qs = self.get_queryset().filter(user_id=user_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def teacher_notifications(self, request):
        user_id = getattr(request.user, "user_id", getattr(request.user, "id", None))
        qs = self.get_queryset().filter(user_id=user_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
