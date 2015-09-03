using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MyStories.Entities.Models
{
    public class GroupDetails
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int NbrOfStories { get; set; }
        public int NbrOfMembers { get; set; }
    }
}
