using System.Collections.Generic;

namespace MyStories.Entities.Models
{ 
    public partial class MyStoriesContext : IMyStoriesStoredProcedures
    {
        public IEnumerable<GroupDetails> GetGroupDetails()
        {
            return Database.SqlQuery<GroupDetails>("getGroups");
        }
    }
}