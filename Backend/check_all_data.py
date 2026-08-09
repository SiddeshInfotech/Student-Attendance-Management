import django, os
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
django.setup()

from users.models import User, Role
from students.models import Student
from teachers.models import Teacher
from departments.models import Department
from branches.models import Branch
from semesters.models import Semester
from classes.models import Class, Division
from subjects.models import Subject, TeacherSubject
from attendance.models import Attendance
from leave_requests.models import LeaveRequest
from notifications.models import Notification

SEP = "=" * 55

def section(title, count):
    print(f"\n{SEP}")
    print(f"  {title}: {count} record(s)")
    print(SEP)

# ── Roles ───────────────────────────────────────────────
roles = Role.objects.all()
section("ROLES", roles.count())
for r in roles:
    print(f"  [{r.role_id}] {r.role_name}")

# ── Users ───────────────────────────────────────────────
users = User.objects.select_related('role').all()
section("USERS", users.count())
for u in users:
    print(f"  [{u.user_id}] {u.full_name} | {u.email} | Role: {u.role.role_name} | Status: {u.status}")

# ── Departments ─────────────────────────────────────────
depts = Department.objects.all()
section("DEPARTMENTS", depts.count())
for d in depts:
    print(f"  [{d.department_id}] {d.department_name}")

# ── Branches ────────────────────────────────────────────
branches = Branch.objects.all()
section("BRANCHES", branches.count())
for b in branches:
    print(f"  [{b.branch_id}] {b.branch_name}")

# ── Semesters ───────────────────────────────────────────
sems = Semester.objects.all()
section("SEMESTERS", sems.count())
for s in sems:
    print(f"  [{s.semester_id}] {s.semester_name}")

# ── Divisions ───────────────────────────────────────────
divs = Division.objects.all()
section("DIVISIONS", divs.count())
for d in divs:
    print(f"  [{d.division_id}] {d.division_name}")

# ── Classes ─────────────────────────────────────────────
classes = Class.objects.all()
section("CLASSES", classes.count())
for c in classes:
    branch = getattr(c, 'branch', None)
    sem = getattr(c, 'semester', None)
    print(f"  [{c.class_id}] {c.class_name} | Branch: {branch} | Sem: {sem}")

# ── Subjects ────────────────────────────────────────────
subjects = Subject.objects.all()
section("SUBJECTS", subjects.count())
for s in subjects:
    print(f"  [{s.subject_id}] {s.subject_name} ({s.subject_code})")

# ── Teachers ────────────────────────────────────────────
teachers = Teacher.objects.select_related('user').all()
section("TEACHERS", teachers.count())
for t in teachers:
    print(f"  [{t.teacher_id}] {t.user.full_name} | Email: {t.user.email}")

# ── Students ────────────────────────────────────────────
students = Student.objects.select_related('user').all()
section("STUDENTS", students.count())
for s in students:
    print(f"  [{s.student_id}] {s.user.full_name} | Email: {s.user.email} | Roll: {s.roll_number}")

# ── Attendance ──────────────────────────────────────────
att = Attendance.objects.all()
section("ATTENDANCE RECORDS", att.count())
for a in att[:5]:
    print(f"  Date: {a.date} | Status: {a.status}")
if att.count() > 5:
    print(f"  ... and {att.count()-5} more records")

# ── Leave Requests ──────────────────────────────────────
leaves = LeaveRequest.objects.all()
section("LEAVE REQUESTS", leaves.count())
for l in leaves[:5]:
    print(f"  [{l.request_id}] {l.start_date} to {l.end_date} | Status: {l.status}")

# ── Notifications ───────────────────────────────────────
notifs = Notification.objects.all()
section("NOTIFICATIONS", notifs.count())
for n in notifs[:5]:
    print(f"  [{n.notification_id}] {n.title} | Read: {n.is_read}")

print(f"\n{'=' * 55}")
print("  DATABASE CHECK COMPLETE")
print(f"{'=' * 55}\n")
