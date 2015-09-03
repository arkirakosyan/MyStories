using System;
using System.Collections.Generic;
using System.Linq;
using MyStories.Entities.Models;
using MyStories.Repository.Repositories;
using Repository.Pattern.Infrastructure;
using Repository.Pattern.Repositories;
using Repository.Pattern.UnitOfWork;
using Service.Pattern;

namespace MyStories.Service
{
    public interface IGroupService : IService<Group>
    {
        IEnumerable<Story> FilterStoriesByGroup(int groupId);
        ServiceActionResult SaveGroup(IUnitOfWorkAsync unitOfWork, Group group);
        ServiceActionResult DeleteGroup(IUnitOfWorkAsync unitOfWork, int id);

    }

    
    public class GroupService : Service<Group>, IGroupService
    {
        private readonly IRepositoryAsync<Group> _repository;

        public GroupService(IRepositoryAsync<Group> repository)
            : base(repository)
        {
            _repository = repository;
        }

        public IEnumerable<Story> FilterStoriesByGroup(int groupId)
        {
            return _repository.FilterStoriesByGroup(groupId);
        }

        public ServiceActionResult SaveGroup(IUnitOfWorkAsync unitOfWork, Group group)
        {
            ServiceActionResult result = new ServiceActionResult();

            if (group.Id <= 0)
            {
                try
                {
                    group.ObjectState = ObjectState.Added;
                    Insert(group);
                    unitOfWork.SaveChanges();
                }
                catch (Exception e)
                {
                    result = ServiceActionResult.CreateFromException(e);
                }
            }
            else
            {
                try
                {
                    group.ObjectState = ObjectState.Modified;
                    Update(group);
                    unitOfWork.SaveChanges();
                }
                catch (Exception e)
                {
                    result = ServiceActionResult.CreateFromException(e);
                }
            }
            return result;
        }
        public ServiceActionResult DeleteGroup(IUnitOfWorkAsync unitOfWork, int id)
        {
            ServiceActionResult result = new ServiceActionResult();

            try
            {
                var group = _repository.Query(x => x.Id == id).Include(x => x.Stories).Select(x => x).First();

                if (group == null)
                {
                    return new ServiceActionResult { HasError = true, Message = "The group does not exists!" };
                }
                if (group.Stories.Count > 0)
                {
                    return new ServiceActionResult { HasError = true, Message = "Group cannot be deleted as it is assigned to stories!" };
                }

                group.ObjectState = ObjectState.Deleted;

                Delete(group);
                unitOfWork.SaveChanges();

                return result;
            }
            catch(Exception e)
            {
                return ServiceActionResult.CreateFromException(e);
            }
        }
    }
}
