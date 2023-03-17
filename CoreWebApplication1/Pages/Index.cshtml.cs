using CoreWebApplication1.Models;
using CoreWebApplication1.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CoreWebApplication1.Pages
{
    public class IndexModel : PageModel
    {
        private readonly IStudent _student;
        public static List<StudentReg> studentlist;

        public IndexModel(IStudent student)
        {
            _student = student;
        }

        public void OnGet()
        {
            studentlist=_student.GetStudent();

        }
    }
}