using System.Web.Mvc;
using MyStories.Entities.Models;
using MyStories.Service;
using Repository.Pattern.UnitOfWork;
using MyStories.Web.Helpers;

namespace MyStories.Web.Controllers
{
    public class GroupController : Controller
    {
        private readonly IStoredProcedureService _storedProcedureService;
        private readonly IGroupService _groupService;
        private readonly IUnitOfWorkAsync  _unitOfWork;
        
         public GroupController(
            IUnitOfWorkAsync unitOfWork,
            IStoredProcedureService storedProcedureService,
            IGroupService groupService)
        {
            _unitOfWork = unitOfWork;
            _groupService = groupService;
            _storedProcedureService = storedProcedureService;
        }
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetGroupDetails()
        {
            return Json(_storedProcedureService.GetGroupDetails(), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult SaveGroup(Group group)
        {
            var result = _groupService.SaveGroup(_unitOfWork, group);
            return Json(result.HasError ? ModelActionResult.GetNotSuccessed(result.Message) : ModelActionResult.GetSuccessed(group.Id, "Group was successfully saved!"), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            var result = _groupService.DeleteGroup(_unitOfWork, id);
            return Json(result.HasError ? ModelActionResult.GetNotSuccessed(result.Message):  ModelActionResult.GetSuccessed("Group was successfully deleted!"), JsonRequestBehavior.AllowGet);
        }
    }
}
