using MyStories.Service;
using Repository.Pattern.UnitOfWork;
using System.Web.Mvc;
using MyStories.Entities.Models;
using System.Linq;
using Microsoft.AspNet.Identity;
using MyStories.Entities.Assitants;
using MyStories.Web.Helpers;

namespace MyStories.Web.Controllers
{
    public class StoryController : Controller
    {
        private readonly IStoryService _storyService;
        private readonly IUnitOfWorkAsync  _unitOfWork;
        
         public StoryController(
            IUnitOfWorkAsync unitOfWork,
            IStoryService storyService)
        {
            _unitOfWork = unitOfWork;
            _storyService = storyService;
        }
        
        //
        // GET: /Story/
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetMyStories(JqxGridSentData jqxGridData)
        {
            var a = new { Rows = _storyService.GetMyStories(jqxGridData, User.Identity.GetUserId()).ToList(), TotalRows = jqxGridData.totalrows };
            return Json(a, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetStory(int id)
        {
            return Json(_storyService.FindStory(id), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllGroups()
        {
            return Json(_storyService.GetAllGroupNameValues(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveStory(Story story)
        {
            if (!ModelState.IsValid)
            {
               return Json(ModelActionResult.GetNotValid("Model is not valid!"), JsonRequestBehavior.AllowGet);
            }

            story.UserId = User.Identity.GetUserId();
            var result = _storyService.SaveStory(_unitOfWork, story);

            return Json(result.HasError ? ModelActionResult.GetNotSuccessed(result.Message) : ModelActionResult.GetSuccessed("Story was successfully saved!"), JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            var result = _storyService.DeleteStory(_unitOfWork, id);
            return Json(result.HasError ? ModelActionResult.GetNotSuccessed(result.Message) : ModelActionResult.GetSuccessed("Story was successfully saved!"), JsonRequestBehavior.AllowGet);
        }
    }
}
