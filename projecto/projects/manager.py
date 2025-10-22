from django.db import models

class ProjectManager(models.Manager):
    def create(self, owner, **extra_fields):
        if not owner:
            raise ValueError(_("User must be registered in the database"))
        
        project = self.model(owner,**extra_fields)
        project.save()
        return project