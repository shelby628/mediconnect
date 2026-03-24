from django.urls import path
from . import views

urlpatterns = [

    # ── Auth ──
    path('signup/', views.signup, name='signup'),
    path('login/',  views.login,  name='login'),

    # ── Doctors ──
    path('doctors/',         views.get_doctors,   name='get_doctors'),
    path('doctors/add/',     views.add_doctor,    name='add_doctor'),
    path('doctors/<int:pk>/', views.doctor_detail, name='doctor_detail'),

    # ── Appointments ──
    path('appointments/',          views.appointments,       name='appointments'),
    path('appointments/<int:pk>/', views.appointment_detail, name='appointment_detail'),

    # ── Consultations ──
    path('consultations/', views.consultations, name='consultations'),

    # ── Tickets ──
    path('tickets/',          views.tickets,       name='tickets'),
    path('tickets/<int:pk>/', views.ticket_detail, name='ticket_detail'),

    # ── Admin Only ──
    path('admin/appointments/', views.all_appointments, name='all_appointments'),
    path('admin/patients/',     views.all_patients,     name='all_patients'),
    path('admin/tickets/',      views.all_tickets,      name='all_tickets'),
]