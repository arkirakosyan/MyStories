using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MyStories.Web.Startup))]
namespace MyStories.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
