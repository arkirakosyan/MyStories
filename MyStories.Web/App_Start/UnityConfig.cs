using Microsoft.Practices.Unity;
using MyStories.Entities.Models;
using MyStories.Service;
using Repository.Pattern.DataContext;
using Repository.Pattern.Ef6;
using Repository.Pattern.Repositories;
using Repository.Pattern.UnitOfWork;

namespace MyStories.Web
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public class UnityConfig
    {
        #region Unity Container
        private static System.Lazy<IUnityContainer> container = new System.Lazy<IUnityContainer>(() =>
        {
            var container = new UnityContainer();
            RegisterTypes(container);
            return container;
        });

        /// <summary>
        /// Gets the configured Unity container.
        /// </summary>
        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }
        #endregion

        /// <summary>Registers the type mappings with the Unity container.</summary>
        /// <param name="unityContainer">The unity container to configure.</param>
        /// <remarks>There is no need to register concrete types such as controllers or API controllers (unless you want to 
        /// change the defaults), as Unity allows resolving a concrete type even if it was not previously registered.</remarks>
        public static void RegisterTypes(IUnityContainer unityContainer)
        {
            // NOTE: To load from web.config uncomment the line below. Make sure to add a Microsoft.Practices.Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            unityContainer
                 .RegisterType<IDataContextAsync, MyStoriesContext>(new PerRequestLifetimeManager())
                 .RegisterType<IUnitOfWorkAsync, UnitOfWork>(new PerRequestLifetimeManager())
                 .RegisterType<IRepositoryAsync<Story>, Repository<Story>>()
                 .RegisterType<IRepositoryAsync<Group>, Repository<Group>>()
                 .RegisterType<IStoryService, StoryService>()
                 .RegisterType<IGroupService, GroupService>()
                 .RegisterType<IMyStoriesStoredProcedures, MyStoriesContext>(new PerRequestLifetimeManager())
                 .RegisterType<IStoredProcedureService, StoredProcedureService>();
        }
    }
}
