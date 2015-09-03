using System;

namespace MyStories.Service
{
    public enum ServiceActionResultType
    {
        Success,
        Warrning,
        Error
    }
    
    public class ServiceActionResult
    {
        #region Properties
        public bool HasError { get; set; }
        public ServiceActionResultType ReturnType { get; set; }
        public Object ReturnValue { get; set; }
        public string Message { get; set; }
        public string ExceptionMessage { get; set; }
        public string ExceptionInnerMessage { get; set; }
        #endregion

        public ServiceActionResult()
        {
            HasError = false;
            ReturnType = ServiceActionResultType.Success;
        }
        public static ServiceActionResult CreateFromException(Exception ex, string message = "")
        {
            ServiceActionResult serviceActionResult = new ServiceActionResult
            {
                HasError = true,
                ExceptionMessage = ex.Message,
                ExceptionInnerMessage = (ex.InnerException == null) ? null : ex.InnerException.Message,
                Message = message,
                ReturnValue = null
            };
            LogManager.LogManager.MaintainException(ex);
            return serviceActionResult;
        } 
    }
}