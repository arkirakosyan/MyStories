using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MyStories.Entities.Models;
using MyStories.Test.UnitTests.Fake;
using Repository.Pattern.DataContext;
using Repository.Pattern.Ef6;
using Repository.Pattern.Infrastructure;
using Repository.Pattern.UnitOfWork;

namespace MyStories.Test.UnitTests.Repository
{
    [TestClass]
    public class StoryRepositoryTest
    {
        [TestMethod]
        public void AddDeleteStoryById()
        {
            using (IDataContextAsync myStoriesFakeContext = new MyStoriesFakeContext())
            using (IUnitOfWorkAsync unitOfWork = new UnitOfWork(myStoriesFakeContext))
            {

                var groups = new List<Group>
                {
                    new Group {Id = 1, Name = "Group1", Description = "Group Desc", ObjectState = ObjectState.Added},
                    new Group {Id = 2, Name = "Group2", Description = "Group Desc", ObjectState = ObjectState.Added}
                };

                foreach (var g in groups)
                {
                    unitOfWork.Repository<Group>().Insert(g);
                }
                
                unitOfWork.Repository<Story>().Insert(new Story {Id = 1, Description = "Desc", Content = "Content", Title = "Title", PostedOn = DateTime.Today, Groups = groups});

                unitOfWork.SaveChanges();

                unitOfWork.Repository<Story>().Delete(1);

                unitOfWork.SaveChanges();

                var story = unitOfWork.Repository<Story>().Find(1);

                Assert.IsNull(story);
            }
        }

        [TestMethod]
        public void FindStoryById()
        {
            using (IDataContextAsync myStoriesFakeContext = new MyStoriesFakeContext())
            using (IUnitOfWorkAsync unitOfWork = new UnitOfWork(myStoriesFakeContext))
            {

                var groups = new List<Group>
                {
                    new Group {Id = 1, Name = "Group1", Description = "Group Desc", ObjectState = ObjectState.Added},
                    new Group {Id = 2, Name = "Group2", Description = "Group Desc", ObjectState = ObjectState.Added}
                };

                foreach (var g in groups)
                {
                    unitOfWork.Repository<Group>().Insert(g);
                }

                unitOfWork.Repository<Story>().Insert(new Story { Id = 1, Description = "Desc", Content = "Content", Title = "Title", PostedOn = DateTime.Today, Groups = groups });
                unitOfWork.Repository<Story>().Insert(new Story { Id = 2, Description = "Desc", Content = "Content", Title = "Title", PostedOn = DateTime.Today, Groups = groups });
                unitOfWork.Repository<Story>().Insert(new Story { Id = 3, Description = "Desc", Content = "Content", Title = "Title", PostedOn = DateTime.Today, Groups = groups });

                unitOfWork.SaveChanges();

                var story = unitOfWork.Repository<Story>().Find(2);

                Assert.IsNotNull(story);
                Assert.AreEqual(2, story.Id);
            }
        }

        [TestMethod]
        public void UpdateStoryById()
        {
            using (IDataContextAsync myStoriesFakeContext = new MyStoriesFakeContext())
            using (IUnitOfWorkAsync unitOfWork = new UnitOfWork(myStoriesFakeContext))
            {

                var groups = new List<Group>
                {
                    new Group {Id = 1, Name = "Group1", Description = "Group Desc", ObjectState = ObjectState.Added},
                    new Group {Id = 2, Name = "Group2", Description = "Group Desc", ObjectState = ObjectState.Added}
                };

                foreach (var g in groups)
                {
                    unitOfWork.Repository<Group>().Insert(g);
                }

                unitOfWork.Repository<Story>().Insert(new Story { Id = 1, Description = "Desc", Content = "Content", Title = "Title", PostedOn = DateTime.Today, Groups = groups });

                var story = unitOfWork.Repository<Story>().Find(1);
                var newGroups = new List<Group>
                {
                    new Group {Id = 3, Name = "New Group1", Description = "Group Desc", ObjectState = ObjectState.Added},
                };
                story.Groups = newGroups;
                unitOfWork.SaveChanges();

                story = unitOfWork.Repository<Story>().Find(1);
                Assert.AreEqual(1, story.Groups.Count);
                Assert.AreEqual(3, story.Groups.First().Id);
            }
        }
    }
}