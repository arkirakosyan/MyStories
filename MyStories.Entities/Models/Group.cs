using System;
using System.Collections.Generic;
using Repository.Pattern.Ef6;

namespace MyStories.Entities.Models
{
    public partial class Group : Entity
    {
        public Group()
        {
            this.Stories = new List<Story>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual ICollection<Story> Stories { get; set; }
    }
}
