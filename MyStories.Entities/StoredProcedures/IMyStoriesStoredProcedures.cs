using System.Collections.Generic;

namespace MyStories.Entities.Models
{
    public interface IMyStoriesStoredProcedures
    {
        IEnumerable<GroupDetails> GetGroupDetails();
    }
}