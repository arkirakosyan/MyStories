using System;
using System.Configuration;
using System.IO;

namespace MyStories.Service.LogManager
{
    public static class LogManager
    {
        public static string LogFilePath
        {
            get
            {
                return Convert.ToString(ConfigurationManager.AppSettings["LogFilePath"]);
            }
        }

        public static void MaintainException(Exception ex)
        {
            WriteLog(ex.Message, Convert.ToString(ex.InnerException));
        }

        public static void WriteLog(string errorMessage, string innerException)
        {
            // Store the script names and test results in a output text file.
            try
            {
                var logFileDirectory = Path.GetDirectoryName(LogFilePath);
                if (logFileDirectory != null && !Directory.Exists(logFileDirectory))
                {
                    Directory.CreateDirectory(logFileDirectory);
                }

                using (StreamWriter writer = new StreamWriter(new FileStream(LogFilePath, FileMode.Append)))
                {
                    writer.WriteLine("[Date : {0}] - [Error : {1}] - [Details : {2}]", DateTime.Now, errorMessage, innerException);
                    writer.WriteLine("------------------------------------------------------------------------------------");
                }
            }
            catch
            {
                // ignored
            }
        }
    }
}
