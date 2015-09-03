using System.Collections;

namespace MyStories.Web.Helpers
{
    public class ModelActionResult
    {
        public bool ModelIsValid { get; set; }
        public bool Successed { get; set; }
        public string Message { get; set; }
        public object ReturnValue { get; set; }
        public ArrayList ExtraValues { get; set; }

        public static ModelActionResult GetSuccessed(string msg = "")
        {
            return new ModelActionResult { ModelIsValid = true, Successed = true, Message = msg };
        }
        public static ModelActionResult GetSuccessed(object returnValue, string msg = "")
        {
            return new ModelActionResult { ModelIsValid = true, ReturnValue = returnValue, Successed = true, Message = msg };
        }

        public static ModelActionResult GetNotSuccessed(string msg = "")
        {
            return new ModelActionResult { ModelIsValid = true, Successed = false, Message = msg };
        }
        public static ModelActionResult GetNotSuccessed(object returnValue, string msg = "")
        {
            return new ModelActionResult { ReturnValue = returnValue, ModelIsValid = true, Successed = false, Message = msg };
        }
        public static ModelActionResult GetNotValid(string msg = "")
        {
            if (string.IsNullOrWhiteSpace(msg))
                msg = "Model is not valid";

            return new ModelActionResult { ModelIsValid = false, Message = msg };
        }
    }
}