using CoreWebApplication1.Models;
using Microsoft.Data.SqlClient;

namespace CoreWebApplication1.Service
{
    public class StudentManagement
    {
        private readonly IConfiguration _configSetting;
        public StudentManagement(IConfiguration configSetting)
        {
            _configSetting = configSetting;
        }


        public List<StudentReg> GetStudent()
        {
            List<StudentReg> liststudentreg = new List<StudentReg>();
            using SqlConnection conn = new SqlConnection(_configSetting.GetConnectionString("ConString"));
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("Select * from StudentTable", conn);
                SqlDataReader reader = cmd.ExecuteReader();
              
                while (reader.Read())
                    {
                        StudentReg student = new StudentReg()
                        {
                            RegID = reader.GetInt32(0),
                            Name = reader.GetString(1),
                            DOB = reader.GetDateTime(2)
                        };
                    liststudentreg.Add(student);
                    }
                conn.Close();
            }

            return liststudentreg;
        }

    }
}
