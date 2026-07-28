from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdmin(BasePermission):
    """Allow access only to users with role == 'admin' or is_superuser."""
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        role = getattr(request.user, "role", "")
        if hasattr(role, "role_name"):
            role = role.role_name
        return role.lower() == "admin" or getattr(request.user, "is_superuser", False)

class IsTeacher(BasePermission):
    """Allow access only to teachers."""
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        role = getattr(request.user, "role", "")
        if hasattr(role, "role_name"):
            role = role.role_name
        return role.lower() == "teacher" or getattr(request.user, "is_superuser", False)

class IsStudent(BasePermission):
    """Allow access only to students."""
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        role = getattr(request.user, "role", "")
        if hasattr(role, "role_name"):
            role = role.role_name
        return role.lower() == "student" or getattr(request.user, "is_superuser", False)

class IsOwnerOrReadOnly(BasePermission):
    """Object-level permission."""
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, "user", None) == request.user
