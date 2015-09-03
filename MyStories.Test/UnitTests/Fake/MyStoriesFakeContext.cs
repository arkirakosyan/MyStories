using MyStories.Entities.Models;
using Repository.Pattern.Ef6;

namespace MyStories.Test.UnitTests.Fake
{
    public class MyStoriesFakeContext : FakeDbContext
    {
        public MyStoriesFakeContext()
        {
            AddFakeDbSet<Story, StoryDbSet>();
            AddFakeDbSet<Group, GroupDbSet>();
        }
    }
}