using System.Data.Entity;
using MyStories.Entities.Models.Mapping;
using Repository.Pattern.Ef6;

namespace MyStories.Entities.Models
{
    public class MyStoriesContextInitializer : CreateDatabaseIfNotExists<MyStoriesContext>
    {
        protected override void Seed(MyStoriesContext context)
        {
            context.Database.ExecuteSqlCommand(@"CREATE PROCEDURE [dbo].[getGroups]
                                                  AS
                                                  BEGIN
                                                      SELECT g.Id,  g.Name, g.Description, COUNT(sg.GroupId) as NbrOfStories, COUNT(distinct u.Id) as NbrOfMembers
                                                      FROM Groups g 
                                                          LEFT JOIN Story_Group sg on sg.GroupId = g.Id
                                                          LEFT JOIN Stories s on s.Id = sg.StoryId
                                                          LEFT JOIN AspNetUsers u on u.Id = s.UserId
                                                      GROUP BY g.Id,  g.Name, g.Description
                                                  END");
        }
    }
    public partial class MyStoriesContext : DataContext
    {
        static MyStoriesContext()
        {
            Database.SetInitializer(new MyStoriesContextInitializer());
        }

        public MyStoriesContext()
            : base("Name=MyStoriesContext")
        {
        }

        public DbSet<AspNetRole> AspNetRoles { get; set; }
        public DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }
        public DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }
        public DbSet<AspNetUser> AspNetUsers { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Story> Stories { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new AspNetRoleMap());
            modelBuilder.Configurations.Add(new AspNetUserClaimMap());
            modelBuilder.Configurations.Add(new AspNetUserLoginMap());
            modelBuilder.Configurations.Add(new AspNetUserMap());
            modelBuilder.Configurations.Add(new GroupMap());
            modelBuilder.Configurations.Add(new StoryMap());
        }
    }
}
