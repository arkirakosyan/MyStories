using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using MyStories.Entities.Models;
using MyStories.Repository.Repositories;
using Repository.Pattern.Repositories;
using Service.Pattern;
using MyStories.Entities.Assitants;
using Repository.Pattern.Infrastructure;
using Repository.Pattern.UnitOfWork;

namespace MyStories.Service
{
    public interface IStoryService : IService<Story>
    {
        IEnumerable<Story> FilterStoriesByPostedOn(DateTime postedOn);
        IEnumerable<Story> GetMyStories(JqxGridSentData jqxSentData, string userId);
        Story FindStory(int storyId);
        IEnumerable<Story> FilterStoriesByUser(string userId);
        IEnumerable GetAllGroupNameValues();
        ServiceActionResult SaveStory(IUnitOfWorkAsync unitOfWork, Story story);
        ServiceActionResult DeleteStory(IUnitOfWorkAsync unitOfWork, int id);

    }

    
    public class StoryService : Service<Story>, IStoryService
    {
        private readonly IRepositoryAsync<Story> _repository;

        public StoryService(IRepositoryAsync<Story> repository)
            : base(repository)
        {
            _repository = repository;
        }

        public IEnumerable<Story> FilterStoriesByPostedOn(DateTime postedOn)
        {
           return _repository.FilterStoriesByPostedOn(postedOn);
        }
        public IEnumerable<Story> GetMyStories(JqxGridSentData jqxSentData, string userId)
        {
            return _repository.GetMyStories(jqxSentData, jqxSentData.showAllStories ? null : userId);
        }
        public Story FindStory(int storyId)
        {
            var story = _repository.Find(storyId);
            if (story != null)
                story.Groups = _repository.GetRepository<Group>().Query(x => x.Stories.Any(s => s.Id == story.Id)).Select(z => z).ToList();

            return story;
        }
        public IEnumerable<Story> FilterStoriesByUser(string userId)
        {
            return _repository.FilterStoriesByUser(userId);
        }
        public IEnumerable GetAllGroupNameValues()
        {
            return _repository.GetRepository<Group>().Queryable().Select(x => new {x.Id, x.Name});
        }
        public ServiceActionResult SaveStory(IUnitOfWorkAsync unitOfWork, Story story)
        {
            ServiceActionResult result = new ServiceActionResult();
            if (story.Id <= 0)
            {
                try
                {
                    story.ObjectState = ObjectState.Added;
                    Insert(story);
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
                    Story storyEntity = _repository.Query(x => x.Id == story.Id).Include(x => x.Groups).Select(x => x).First();
                    storyEntity.ObjectState = ObjectState.Modified;
                    storyEntity.Title = story.Title;
                    storyEntity.Description = story.Description;
                    storyEntity.Content = story.Content;
                    storyEntity.PostedOn = story.PostedOn;
                    storyEntity.Groups = new List<Group>();
                    foreach (var gr in story.Groups)
                    {
                        int id = gr.Id;
                        storyEntity.Groups.Add(unitOfWork.RepositoryAsync<Group>().Query(x => x.Id == id).Select(x => x).First());
                    }
                    
                    Update(storyEntity);
                    unitOfWork.SaveChanges();
                    result.Message = "Story was successfully updated!";
                }
                catch (Exception e)
                {
                    result = ServiceActionResult.CreateFromException(e);
                }
            }

            return result;
        }
        public ServiceActionResult DeleteStory(IUnitOfWorkAsync unitOfWork, int id)
        {
            try
            {
                Story story = _repository.Query(x => x.Id == id).Include(x => x.Groups).Select(x => x).FirstOrDefault();

                if (story == null)
                {
                    return new ServiceActionResult
                    {
                        HasError = true,
                        Message = "Story does not exists!",
                        ReturnType = ServiceActionResultType.Warrning
                    };

                }
                story.ObjectState = ObjectState.Deleted;

                Delete(story);
                unitOfWork.SaveChanges();
                return new ServiceActionResult();
            }
            catch(Exception e)
            {
                return ServiceActionResult.CreateFromException(e);
            }
        }
    }
}
