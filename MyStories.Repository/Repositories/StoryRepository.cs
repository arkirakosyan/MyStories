using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using MyStories.Entities.Models;
using MyStories.Repository.Queries;
using Repository.Pattern.Ef6;
using Repository.Pattern.Repositories;
using MyStories.Entities.Assitants;

namespace MyStories.Repository.Repositories
{
    public static class StoryRepository
    {
        public static IEnumerable<Story> FilterStoriesByPostedOn(this IRepositoryAsync<Story> repository, DateTime postedOn)
        {
            MyStoryQuery sq = new MyStoryQuery();
            sq.PostedOn(postedOn);
            return repository.Query(sq).Select().AsEnumerable();
        }

        public static IEnumerable<Story> GetMyStories(this IRepositoryAsync<Story> repository, JqxGridSentData jqxGridSentData, string userId = null)
        {
            
            MyStoryQuery sq = new MyStoryQuery();
            if (!string.IsNullOrWhiteSpace(userId))
                sq.UserStories(userId);

            if (!string.IsNullOrWhiteSpace(jqxGridSentData.searchKey))
                sq.SearchByTitle(jqxGridSentData.searchKeyLower);

            int t;
            var result = repository.Query(sq).OrderByField(jqxGridSentData.sortorder,jqxGridSentData.sortdatafield)
                            .SelectPage(jqxGridSentData.pagenum + 1, jqxGridSentData.pagesize, out t).Select(x => new Story(){Id = x.Id, Title = x.Title, Description = x.Description, PostedOn = x.PostedOn, UserId = x.UserId }).AsEnumerable();
            
            jqxGridSentData.totalrows = t;
            return result;
        }
      
        public static IEnumerable<Story> FilterStoriesByUser(this IRepositoryAsync<Story> repository, string userId)
        {
            MyStoryQuery sq = new MyStoryQuery();
            return repository.Query(sq.UserStories(userId)).Select().AsEnumerable();
        }
    }
}