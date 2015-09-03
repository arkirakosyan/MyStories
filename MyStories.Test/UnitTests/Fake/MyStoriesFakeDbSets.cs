using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MyStories.Entities.Models;
using Repository.Pattern.Ef6;

namespace MyStories.Test.UnitTests.Fake
{
    public class StoryDbSet : FakeDbSet<Story>
    {
        public override Story Find(params object[] keyValues)
        {
            return this.SingleOrDefault(t => t.Id == (int)keyValues.FirstOrDefault());
        }

        public override Task<Story> FindAsync(CancellationToken cancellationToken, params object[] keyValues)
        {
            return new Task<Story>(() => Find(keyValues));
        }
    }

    public class GroupDbSet : FakeDbSet<Group>
    {
        public override Group Find(params object[] keyValues)
        {
            return this.SingleOrDefault(t => t.Id == (int)keyValues.FirstOrDefault());
        }

        public override Task<Group> FindAsync(CancellationToken cancellationToken, params object[] keyValues)
        {
            return new Task<Group>(() => Find(keyValues));
        }
    }
}