import uuid
from datetime import datetime
from app.utils.logger import app_logger
from app.config.settings import (
    STATUS_OK, STATUS_CREATED, STATUS_NOT_FOUND, STATUS_CONFLICT, 
    DEFAULT_PAGE, DEFAULT_PER_PAGE
)

# Shared In-memory storage for students
_students = {}

# Seed initial mock students for system usability
def seed_students():
    if not _students:
        s1 = str(uuid.uuid4())
        s2 = str(uuid.uuid4())
        s3 = str(uuid.uuid4())
        
        _students[s1] = {
            "id": s1,
            "name": "Alice Smith",
            "roll_number": "R001",
            "email": "alice.smith@example.com",
            "class_name": "Class 10-A",
            "phone": "+1234567890",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        _students[s2] = {
            "id": s2,
            "name": "Bob Johnson",
            "roll_number": "R002",
            "email": "bob.johnson@example.com",
            "class_name": "Class 10-A",
            "phone": "+1234567891",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        _students[s3] = {
            "id": s3,
            "name": "Charlie Brown",
            "roll_number": "R003",
            "email": "charlie.brown@example.com",
            "class_name": "Class 10-B",
            "phone": "+1234567892",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

seed_students()

class StudentService:
    """
    Service layer handling Student CRUD and filtering actions.
    """

    @staticmethod
    def get_all(page: int = DEFAULT_PAGE, per_page: int = DEFAULT_PER_PAGE, search: str = None, class_name: str = None) -> tuple:
        filtered_students = list(_students.values())

        # Filtering by class_name
        if class_name:
            filtered_students = [s for s in filtered_students if s["class_name"].lower() == class_name.lower()]

        # General Search query mapping name, email, roll_number
        if search:
            search = search.lower()
            filtered_students = [
                s for s in filtered_students 
                if search in s["name"].lower() or 
                   search in s["email"].lower() or 
                   search in s["roll_number"].lower()
            ]

        # Pagination calculations
        total_items = len(filtered_students)
        start = (page - 1) * per_page
        end = start + per_page
        paginated_students = filtered_students[start:end]

        return {
            "success": True,
            "message": "Students retrieved successfully.",
            "data": {
                "students": paginated_students,
                "total": total_items,
                "page": page,
                "per_page": per_page
            }
        }, STATUS_OK

    @staticmethod
    def get_by_id(student_id: str) -> tuple:
        student = _students.get(student_id)
        if not student:
            app_logger.warning(f"Student lookup failed: ID {student_id} not found.")
            return {
                "success": False,
                "message": "Student not found."
            }, STATUS_NOT_FOUND

        return {
            "success": True,
            "message": "Student found.",
            "data": student
        }, STATUS_OK

    @staticmethod
    def add(data: dict) -> tuple:
        roll_number = data["roll_number"].strip()
        email = data["email"].strip().lower()

        # Check for duplication conflicts
        for s in _students.values():
            if s["roll_number"] == roll_number:
                return {"success": False, "message": "Roll number already exists."}, STATUS_CONFLICT
            if s["email"] == email:
                return {"success": False, "message": "Email already exists."}, STATUS_CONFLICT

        student_id = str(uuid.uuid4())
        new_student = {
            "id": student_id,
            "name": data["name"].strip(),
            "roll_number": roll_number,
            "email": email,
            "class_name": data["class_name"].strip(),
            "phone": data.get("phone"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        _students[student_id] = new_student
        app_logger.info(f"Student added: {roll_number} - {new_student['name']}")

        return {
            "success": True,
            "message": "Student added successfully.",
            "data": new_student
        }, STATUS_CREATED

    @staticmethod
    def update(student_id: str, data: dict) -> tuple:
        student = _students.get(student_id)
        if not student:
            return {"success": False, "message": "Student not found."}, STATUS_NOT_FOUND

        roll_number = data.get("roll_number", "").strip()
        email = data.get("email", "").strip().lower()

        # Check duplicate details against other students
        for s in _students.values():
            if s["id"] != student_id:
                if roll_number and s["roll_number"] == roll_number:
                    return {"success": False, "message": "Roll number already assigned to another student."}, STATUS_CONFLICT
                if email and s["email"] == email:
                    return {"success": False, "message": "Email already assigned to another student."}, STATUS_CONFLICT

        # Apply updates
        if "name" in data: student["name"] = data["name"].strip()
        if "roll_number" in data: student["roll_number"] = roll_number
        if "email" in data: student["email"] = email
        if "class_name" in data: student["class_name"] = data["class_name"].strip()
        if "phone" in data: student["phone"] = data["phone"]
        
        student["updated_at"] = datetime.utcnow()
        app_logger.info(f"Student updated: {student_id}")

        return {
            "success": True,
            "message": "Student updated successfully.",
            "data": student
        }, STATUS_OK

    @staticmethod
    def delete(student_id: str) -> tuple:
        if student_id not in _students:
            return {"success": False, "message": "Student not found."}, STATUS_NOT_FOUND

        deleted_student = _students.pop(student_id)
        app_logger.info(f"Student deleted: {student_id} - {deleted_student['name']}")
        return {
            "success": True,
            "message": "Student deleted successfully."
        }, STATUS_OK

    @staticmethod
    def search(query: str) -> tuple:
        """
        Quick search student endpoint utility.
        """
        return StudentService.get_all(search=query)

    @staticmethod
    def get_count() -> int:
        return len(_students)
