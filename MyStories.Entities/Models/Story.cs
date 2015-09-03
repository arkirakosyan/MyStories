using System;
using System.Collections.Generic;
using Repository.Pattern.Ef6;

namespace MyStories.Entities.Models
{
    public partial class Story : Entity
    {
        public Story()
        {
            this.Groups = new List<Group>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public System.DateTime PostedOn { get; set; }
        public string UserId { get; set; }
        public virtual ICollection<Group> Groups { get; set; }
    }
}
