from django.urls import path
from . import views

urlpatterns = [

    # ── Auth ──
      path('', views.home),
    path('signup/', views.signup, name='signup'),
    path('login/',  views.login,  name='login'),

    # ── Doctors ──
    # IMPORTANT: 'me' routes must come BEFORE '<int:pk>' routes or Django
    # will try to cast 'me' as an integer and 404.
    path('doctors/',                        views.get_doctors,          name='get_doctors'),
    path('doctors/add/',                    views.add_doctor,           name='add_doctor'),
    path('doctors/me/appointments/',        views.doctor_appointments,  name='doctor_appointments'),
    path('doctors/me/status/',              views.update_doctor_status, name='update_doctor_status'),
    path('doctors/<int:pk>/',               views.doctor_detail,        name='doctor_detail'),

    # ── Appointments ──
    path('appointments/',                   views.appointments,               name='appointments'),
    path('appointments/<int:pk>/',          views.appointment_detail,         name='appointment_detail'),
    path('appointments/<int:pk>/status/',   views.update_appointment_status,  name='update_appointment_status'),

    # ── Consultations ──
    path('consultations/',                  views.consultations,       name='consultations'),
    path('consultations/write/',            views.write_consultation,  name='write_consultation'),

    # ── Tickets ──
    path('tickets/',                        views.tickets,         name='tickets'),
    path('tickets/<int:pk>/respond/',       views.ticket_respond,  name='ticket_respond'),

    # ── Admin Only ──
    path('admin/appointments/',             views.all_appointments, name='all_appointments'),
    path('admin/patients/',                 views.all_patients,     name='all_patients'),
    path('admin/tickets/',                  views.all_tickets,      name='all_tickets'),
]