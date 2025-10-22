from django.db import models
from django.conf import settings

class ProjectLead(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="projects")
    projectname = models.CharField(max_length=100)
    description = models.CharField(max_length=250)
    frontend = models.BooleanField(default=False)
    backend = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (("owner","projectname"))

class ProjectRequest(models.Model):
    owner = models.ForeignKey(ProjectLead,on_delete=models.CASCADE,related_name="project_lead")
    member = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="project_member")

    class Meta:
        unique_together = (("owner","member"))