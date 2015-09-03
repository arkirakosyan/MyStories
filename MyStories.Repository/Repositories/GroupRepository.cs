using System.Collections;
using System.Collections.Generic;
using System.Linq;
using MyStories.Entities.Models;
using Repository.Pattern.Repositories;

namespace MyStories.Repository.Repositories
{
    public static class GroupRepository
    {
       public static IEnumerable<Story> FilterStoriesByGroup(this IRepositoryAsync<Group> repository, int groupId)
       {
            var a = repository.Queryable().FirstOrDefault(g => g.Id == groupId);
            return a != null ? a.Stories.AsEnumerable() : null;
       }
    }
}