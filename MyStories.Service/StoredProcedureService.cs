using System.Collections.Generic;
using MyStories.Entities.Models;

namespace MyStories.Service
{
    public interface IStoredProcedureService
    {
        IEnumerable<GroupDetails> GetGroupDetails();
    }

    public class StoredProcedureService : IStoredProcedureService
    {
        private readonly IMyStoriesStoredProcedures _storedProcedures;

        public StoredProcedureService(IMyStoriesStoredProcedures storedProcedures)
        {
            _storedProcedures = storedProcedures;
        }
        public IEnumerable<GroupDetails> GetGroupDetails()
        {
            return _storedProcedures.GetGroupDetails();
        }
    }
}