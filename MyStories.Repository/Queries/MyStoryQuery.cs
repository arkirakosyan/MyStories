using System;
using System.Linq;
using MyStories.Entities.Models;
using Repository.Pattern.Ef6;

namespace MyStories.Repository.Queries
{
    public class MyStoryQuery : QueryObject<Story>
    {
        public MyStoryQuery UserStories(string userId)
        {
            And(x => x.UserId == userId);
            return this;
        }
        public MyStoryQuery SearchByTitle(string searchKey)
        {
            And(x => x.Title.ToLower().Contains(searchKey));
            return this;
        }
        public MyStoryQuery PostedOn(DateTime postedOn)
        {
            And(x => x.PostedOn.Equals(postedOn));
            return this;
        }
    }
}