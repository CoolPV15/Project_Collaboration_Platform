from django.contrib import admin
from .models import ProjectLead, ProjectRequest, ProjectMembers, ProjectRequestRejected

admin.site.register(ProjectLead)
admin.site.register(ProjectRequest)
admin.site.register(ProjectMembers)
admin.site.register(ProjectRequestRejected)